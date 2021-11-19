// controller sẽ gọi hàm từ product.complete.js có sẵn
const http_message = require("../../constants/http_message.constant");
const product_service = require("../../models/Product/Product.service");
const user_service = require("../../models/user/user.service");
const product_combiner = require("./product.combiner");
const product_scheduler = require("./product.scheduler");
const mailer_helper = require("../../helpers/mailer.helper");
const jwt_helper = require("../../helpers/jwt.helper");
const { handlePagingResponse } = require("../../helpers/etc.helper");
const io = require("../../helpers/socket.helper");
const moment = require("moment");

// public
module.exports.ultimateSearchProduct = async (req, res) => {
  const token = jwt_helper.getPayloadFromHeaderToken(req) || { id: null };

  const {
    sub_category_id,
    keyword,
    page,
    limit,
    order_by,
    order_type,
    is_self,
    is_expire,
    status,
  } = req.query;

  const status_accept = ["on", "off"];
  if (status && status !== "" && !status_accept.includes(status)) {
    return res.status(400).json({
      errs: ["status phải là 1 trong những: " + status_accept.join(", ")],
    });
  }

  const order_by_accept = [
    "create_at",
    "expire_at",
    "hidden_price",
    "buy_price",
    "start_price",
  ];
  if (order_by && order_by !== "" && !order_by_accept.includes(order_by)) {
    return res.status(400).json({
      errs: ["order_by phải là 1 trong những: " + order_by_accept.join(", ")],
    });
  }

  const order_type_accept = ["ASC", "DESC"];
  if (
    order_type &&
    order_type !== "" &&
    !order_type_accept.includes(order_type)
  ) {
    return res.status(400).json({
      errs: [
        "order_type phải là 1 trong những: " + order_type_accept.join(", "),
      ],
    });
  }

  const list = await product_service.getUltimate(
    sub_category_id,
    keyword,
    [],
    page,
    limit,
    order_by,
    order_type,
    is_self,
    token.id,
    is_expire,
    status
  );

  const rs = handlePagingResponse(list, page, limit);

  //thêm thông ảnh, holder, seller...
  if (rs) {
    rs.data = await product_combiner.addFieldForArrayProduct(rs.data);
  }

  return res.json(rs);
};

module.exports.getProductDetails = async (req, res) => {
  const product_id = req.params.id;

  const rs = await product_combiner.getAllProductDetailsById(product_id);

  if (!rs.product_id) {
    return res.status(204).json({});
  }

  return res.json(rs);
};

// seller
module.exports.createProductPost = async (req, res) => {
  const token = req.token;
  const errs = [];
  const { start_price, step_price, buy_price, expire_at } = req.body;

  const now = moment(
    moment()
      .utcOffset(7 * 60)
      .format("DD/MM/YYYY HH:mm:ss"),
    "DD/MM/YYYY HH:mm:ss"
  );
  
  console.log("now ", now.format("DD/MM/YYYY HH:mm:ss"));

  const end = moment(expire_at, "DD/MM/YYYY HH:mm:ss");
  console.log("end", end.format("DD/MM/YYYY HH:mm:ss"));
  const duration = moment.duration(end.diff(now));
  const minutes = duration.asMinutes();

  console.log("\nminutes", minutes);
  console.log("minutes < 10.0", minutes < 10.0);
  console.log("now >= end", now >= end);

  if (minutes < 10.0 || now >= end) {
    errs.push("Thời gian kết thúc tối thiểu phải là 10 phút kể từ hiện tại");
  } else if (now.add(8, "minutes") >= end) {
    errs.push("Thời gian kết thúc tối thiểu phải là 10 phút kể từ hiện tại");
  }
  console.log("now (add 8 mins) >= end", now >= end, "\n");

  if (
    +start_price < 1000 ||
    +step_price < 1000 ||
    (buy_price && +buy_price < 1000)
  ) {
    errs.push(http_message.status400_price.message);
  }

  if (buy_price && start_price + step_price > buy_price) {
    errs.push(http_message.status400_buy_price.message);
  }

  if (+step_price >= +start_price) {
    errs.push(http_message.status400_step_price.message);
  }

  if (+start_price % +step_price !== 0) {
    errs.push(http_message.status400_price_divine_step.message);
  }

  if (errs.length > 0) {
    return res.status(400).json({ errs });
  }

  const new_data = await product_service.createNewProduct(req.body, token.id);
  await product_scheduler.addNewProductToAliveArray(new_data);
  return res.json(new_data);
};

module.exports.appendProductDetail = async (req, res) => {
  const token = req.token;
  const { detail, product_id } = req.body;
  await product_service.updateAppendDetail(detail, product_id, token.id);
  const rs = await product_service.getProductDetails(product_id, []);

  // gửi email cho người giữ giá cao nhất nếu có
  if (rs.bidder_id) {
    const bidder = await user_service.findUserById(rs.bidder_id);

    const html = await mailer_helper.replaceHTML(
      "Sản phâm có thêm mô tả",
      `Chào ${bidder.name}, Một sản phẩm trên sàn EzBid mà bạn đang giữ giá vừa có thêm mô tả từ người bán.`,
      `Tên sản phẩm: ${product.name}`,
      "XEM NGAY",
      `${process.env.CLIENT_URL}/detail/${product.product_id}`
    );

    await mailer_helper.send(
      "Sản phâm có thêm mô tả",
      bidder.email,
      bidder.name,
      html
    );
  }

  //gửi socket khi seller update thêm đuôi chi tiết sản phẩm
  io.boardCast(product_id);

  return res.json(rs);
};

// admin
module.exports.deleteProduct = async (req, res) => {
  const product_id = req.params.id;
  await product_service.deleteProductFake(product_id);
  await product_scheduler.deleteProductFromAliveArray(product_id);

  //gửi socket khi admin gỡ sản phẩm
  io.boardCast(product_id);

  return res.json(http_message.status200);
};
