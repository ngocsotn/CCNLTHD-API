const auction_history_service = require('../../models/AuctionHistory/auctionHistory.service');

module.exports.getSelfHistory = async (req, res) => {
	const token = req.token;
	const { page, limit, status, order_type } = req.query;
	const rs = await auction_history_service.findByUserId(token.id, page, limit, status, order_type, 'last_bid_at', []);

	return res.json(rs);
};
