const product_service = require("../../models/Product/Product.service");
const product_combiner = require("../product/product.combiner");
const auction_service = require("../../models/auction/auction.service");
const user_service = require("../../models/user/user.service");
const {
  handlePagingResponse,
  maskUsername,
} = require("../../helpers/etc.helper");
const http_message = require("../../constants/http_message.constant");
const moment = require("moment");
// moment().utcOffset('+07:00');

//public
// xem lịch sử ra giá của 1 sản phẩm nào đó
module.exports.getBiddingHistory = async (req, res) => {
  const product_id = req.params.id;
  const { page, limit } = req.query;
  const product = await product_service.getProductDetails(product_id, []);

  const list = await auction_service.getAllByProductId(
    product_id,
    page,
    limit,
    "bid_at",
    "DESC",
    []
  );
  const rs = handlePagingResponse(list, page, limit);
  rs.bidder_id = product && product.bidder_id ? product.bidder_id : null;

  for (const item of rs.data) {
    if (item.user_id) {
      const bidder = await user_service.findUserById(item.user_id, [
        "password",
        "refresh_token",
      ]);
      item.dataValues.name = maskUsername(bidder.name);
    }
  }

  // const test = await auction_service.getSecondPlaceBidder(2, 1);
  // console.log(test);

  return res.json(rs);
};

//bidder
// xem danh sách sản phẩm bản thân đã, đang tham gia
module.exports.getSelfAreJoined = async (req, res) => {
  const token = req.token;
  const { page, limit } = req.query;

  const list = await auction_service.getAllDistinctByUserId(
    token.id,
    page,
    limit,
    "bid_at",
    "DESC",
    []
  );
  const rs = handlePagingResponse(list, page, limit);
  // thêm thông tin sản phẩm chi tiết vào cho từng item...
  await product_combiner.getAllProductDetailsByIdArray(rs.data);

  return res.json(rs);
};

//mua ngay
module.exports.postBuyNow = async (req, res) => {
  const token = req.token;
  const { product_id } = req.body;

  const is_valid_bidder = await checkBidderValid(token.id, product_id);
  if (is_valid_bidder) {
    return res.status(400).json(is_valid_bidder);
  }

  // đếm lại số ng tham gia bid
  const join_count = await auction_service.getCountUserByProductId(product_id);
  await product_service.updateJoinCount(product_id, +join_count);

  const product = await product_service.getProductDetails(product_id, []);
  if (!product.buy_price) {
    return res.status(400).json({ errs: ["Sẩn phẩm này không thể mua ngay"] });
  }

  if (product.buy_price < 2000) {
    return res.status(400).json({ errs: ["Sẩn phẩm này không thể mua ngay"] });
  }

  await product_service.updateBuyNow(product_id, token.id);
  await auction_service.createNewAuction(
    token.id,
    product_id,
    "accepted",
    price
  );
  //tạo giao dịch và lịch sử đấu giá

  //send socket...
  return res.json(http_message.status200);
};

// bid sản phẩm
module.exports.postBidProduct = async (req, res) => {
  const token = req.token;
  const { price, product_id } = req.body;
  const is_valid_bidder = await checkBidderValid(token.id, product_id);
  const product = await product_service.getProductDetails(product_id, []);

  if (is_valid_bidder) {
    return res.status(400).json(is_valid_bidder);
  }

  if (price < product.hidden_price) {
    return res
      .status(400)
      .json({ errs: [http_message.status_400_less_price_bid.message] });
  }

  if (+price % product.step_price !== 0) {
    return res
      .status(400)
      .json({ errs: [http_message.status_400_step_price_bid.message] });
  }

  //nếu có giá mua ngay
  //nếu giá hiện tại >= giá mua ngay thì xong đấu giá
  if (product.buy_price) {
    if (price >= product.buy_price && product.buy_price > 1000) {
      await auction_service.createNewAuction(
        token.id,
        product_id,
        "accepted",
        price
      );
      await product_service.updateShowPrice(product_id, price);
      await product_service.updateProductStatus(product_id, "off");

      // đếm lại số ng tham gia bid
      const join_count = await auction_service.getCountUserByProductId(
        product_id
      );
      await product_service.updateJoinCount(product_id, +join_count);

      // update tăng số lượt bid
      await product_service.updateIncreaseBidCount(product_id);

      // gửi socket

      return res.json({ errs: ["Bạn đã chiến thắng!"] });
    }
  }

  if (price <= product.hidden_price) {
    if (price > product.price) {
      await auction_service.createNewAuction(
        token.id,
        product_id,
        "accepted",
        price
      );
      await product_service.updateShowPrice(product_id, price);

      // đếm lại số ng tham gia bid
      const join_count = await auction_service.getCountUserByProductId(
        product_id
      );
      await product_service.updateJoinCount(product_id, +join_count);

      // update tăng số lượt bid
      await product_service.updateIncreaseBidCount(product_id);

      //Gửi socket...
    }

    return res
      .status(400)
      .json({ errs: [http_message.status_400_less_price_bid.message] });
  }

  //nếu pass hết check
  await auction_service.createNewAuction(
    token.id,
    product_id,
    "accepted",
    price
  );
  await product_service.updateHolderAndHiddenPrice(product_id, token.id, price);

  // đếm lại số ng tham gia bid
  const join_count = await auction_service.getCountUserByProductId(product_id);
  await product_service.updateJoinCount(product_id, +join_count);

  // update tăng số lượt bid
  await product_service.updateIncreaseBidCount(product_id);

  //Gửi socket...

  return res.json(http_message.status200);
};

const checkBidderValid = async (user_id, product_id) => {
  const bidder = await user_service.findUserById(user_id, []);

  if (
    (bidder.point_dislike / (bidder.point_dislike + bidder.point_like)) * 100 <
    20
  ) {
    return { errs: [http_message.status_400_point_is_low.message] };
  }

  const is_blocked = await auction_service.getUserByIdAndStatus(
    user_id,
    "denied"
  );

  if (is_blocked) {
    return { errs: [http_message.status400_blocked_user.message] };
  }

  const product = await product_service.getProductDetails(product_id, []);
  const now = moment().utcOffset("+07:00");

  if (product.status !== "on") {
    return { errs: [http_message.status_400_bid_time_over.message] };
  }

  if (now > moment(product.expire_at, "DD/MM/YYYY HH:mm:ss")) {
    return { errs: [http_message.status_400_bid_time_over.message] };
  }

  return null;
};

//seller
module.exports.postBlockUser = async (req, res) => {
  const { user_id, product_id } = req.body;
  await auction_service.updateStatus(user_id, product_id, "denied");

  // lấy product kiểm tra xem holder id trùng không
  const product = await product_service.getProductDetails(product_id, []);

  //thay thế nếu đó là holder cao nhất hiện tại trong product, thay user 2nd || null
  if (+product.bidder_id === +user_id) {
    const second_bidder = await auction_service.getSecondPlaceBidder(
      user_id,
      product_id
    );

    if (second_bidder) {
      await product_service.updateHolderAndHiddenPrice(
        product_id,
        second_bidder.user_id,
        second_bidder.price
      );
    } else {
      await product_service.updateHolderAndHiddenPrice(
        product_id,
        null,
        product.start_price
      );
    }
  }

  return res.json(http_message.status200);
};
