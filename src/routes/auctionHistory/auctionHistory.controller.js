const auction_history_service = require('../../models/AuctionHistory/auctionHistory.service');
const { handlePagingResponse } = require("../../helpers/etc.helper");
const product_combiner = require("../product/product.combiner");

module.exports.getSelfHistory = async (req, res) => {
	const token = req.token;
	const { page, limit, status, order_type } = req.query;
	const list = await auction_history_service.findByUserId(token.id, page, limit, status, order_type, 'last_bid_at', []);

  const rs = handlePagingResponse(list, +page, +limit);

  // thêm thông tin sản phẩm chi tiết vào cho từng item...
  await product_combiner.getAllProductDetailsByIdArray(rs.data);

	return res.json(rs);
};
