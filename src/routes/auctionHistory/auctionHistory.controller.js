const auction_history_service = require("../../models/AuctionHistory/auctionHistory.service");
const rate_service = require("../../models/Rate/rate.service");
const { handlePagingResponse } = require("../../helpers/etc.helper");
const product_combiner = require("../product/product.combiner");

module.exports.getSelfHistory = async (req, res) => {
  const token = req.token;
  const { page, limit, status, order_type } = req.query;

  const status_accept = ["win", "lose", "denied", "cancel"];
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

  const list = await auction_history_service.findByUserId(
    token.id,
    page,
    limit,
    status,
    order_type,
    "last_bid_at",
    []
  );

  const rs = handlePagingResponse(list, +page, +limit);
  for (const item of rs.data) {
    const check = await rate_service.findAllByUserId1AndProductId(
      token.id,
      item.product_id
    );
    if (check) {
      item.dataValues.is_rate = true;
    } else {
      item.dataValues.is_rate = false;
    }
  }

  // thêm thông tin sản phẩm chi tiết vào cho từng item...
  await product_combiner.getAllProductDetailsByIdArray(rs.data);

  return res.json(rs);
};
