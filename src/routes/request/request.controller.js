const request_service = require("../../models/Request/request.service");
const user_service = require("../../models/user/user.service");
const http_message = require("../../constants/http_message.constant");
const { handlePagingResponse } = require("../../helpers/etc.helper");
const moment = require("moment");
// moment().utcOffset('+07:00');

//bidder
module.exports.bidderGet = async (req, res) => {
  //trả no content = có thể tạo request mới
  const token = req.token;
  const rs = await request_service.findByUserId(token.id, []);
  if (!rs) {
    return res.status(204).json({});
  }

  // nếu đang chờ + đã quá hạn -> cho tạo rq mới
  const now = moment(
    moment()
      .utcOffset(7 * 60)
      .format("DD/MM/YYYY HH:mm:ss"),
    "DD/MM/YYYY HH:mm:ss"
  );
  if (
    rs.status !== "accepted" &&
    now > moment(rs.expire_at, "DD/MM/YYYY").utcOffset(0)
  ) {
    return res.status(204).json({});
  }

  return res.json(rs);
};

module.exports.bidderPost = async (req, res) => {
  const token = req.token;
  const { message } = req.body;
  console.log(token.id);
  const user = await user_service.findUserById(token.id, []);

  if (user.role !== "bidder") {
    return res.status(400).json({
      errs: ["Bạn đã có quyền hạn cao hơn bidder, không thể xin nữa"],
    });
  }

  const rs = await request_service.findByUserId(token.id, []);

  if (!rs) {
    const new_data = await request_service.createNewRequest(token.id, message);
    return res.json(new_data);
  }

  //nếu tồn tại và chưa hết hạn thì không tạo mới được, phải chờ hết hạn
  if (moment() <= moment(rs.expire_at, "DD/MM/YYYY")) {
    return res
      .status(400)
      .json({ errs: [http_message.status_400_request_alive.message] });
  }

  // nếu tồn tại hết hạn thì xóa rồi tạo mới
  await request_service.deleteByUserId(token.id);
  const new_data = await request_service.createNewRequest(token.id, message);
  return res.json(new_data);
};

//admin
module.exports.adminGetAll = async (req, res) => {
  const { page, limit, order_by, order_type, status } = req.query;

  const list = await request_service.findAll(
    page,
    limit,
    order_by,
    order_type,
    status,
    []
  );

  const status_accept = ["pending", "accepted", "denied"];
  if (status && status !== "" && !status_accept.includes(status)) {
    return res.status(400).json({
      errs: ["status phải là 1 trong những: " + status_accept.join(", ")],
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

  const order_by_accept = ["create_at", "expire_at"];
  if (order_by && order_by !== "" && !order_by_accept.includes(order_by)) {
    return res.status(400).json({
      errs: ["order_by phải là 1 trong những: " + order_by_accept.join(", ")],
    });
  }

  const rs = handlePagingResponse(list, page, limit);
  for (const item of rs.data) {
    const bidder = await user_service.findUserById(item.user_id, [
      "password",
      "code",
      "refresh_token",
    ]);
    item.dataValues.name = bidder.name;
    item.dataValues.email = bidder.email;
  }

  return res.json(rs);
};

module.exports.adminGet = async (req, res) => {
  const user_id = req.params.id;
  const rs = await request_service.findByUserId(user_id, []);
  if (!rs) {
    return res.status(204).json({});
  }

  return res.json(rs);
};

module.exports.adminPut = async (req, res) => {
  const { user_id, status } = req.body;

  const status_accept = ["accepted", "denied"];
  if (status && status !== "" && !status_accept.includes(status)) {
    return res.status(400).json({
      errs: ["status phải là 1 trong những: " + status_accept.join(", ")],
    });
  }

  const rs = await request_service.findByUserId(user_id, []);
  const now = moment(
    moment()
      .utcOffset(7 * 60)
      .format("DD/MM/YYYY HH:mm:ss"),
    "DD/MM/YYYY HH:mm:ss"
  );

  if (
    rs.status !== "pending" ||
    now > moment(rs.expire_at, "DD/MM/YYYY").utcOffset(0)
  ) {
    return res
      .status(400)
      .json({ errs: ["Yêu cầu này đã duyệt/từ chối hoặc đã hết hiệu lực"] });
  }

  if (status === "accepted") {
    await request_service.updateStatus(user_id, status);
    await user_service.updateRole(user_id, "seller");
  } else if (status === "denied") {
    await request_service.updateStatus(user_id, status);
  }

  return res.json(http_message.status200);
};
