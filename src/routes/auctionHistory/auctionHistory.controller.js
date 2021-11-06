const auction_history_service = require('../../models/AuctionHistory/auctionHistory.service');

module.exports.getSelfHistory = async (req, res) => {
	const token = req.token;
	const { page, limit, status, order_type, order_by } = req.query;
	const rs = await auction_history_service.findByUserId(token.id, page, limit, status, order_type, order_by, []);

  return res.json(rs);
};
