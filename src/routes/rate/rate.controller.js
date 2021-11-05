const rate_service = require('../../models/Rate/rate.service');
const trade_service = require('../../models/TradeHistory/TradeHistory.service');
const { getTotalPage } = require('../../helpers/etc.helper');
const http_message = require('../../constants/http_message.constant');

module.exports.getSelfRate = async (req, res) => {
	const token = req.token;
	const { page, limit, order_by, order_type } = req.query;
	const rs = {};
	const list = await rate_service.findAllByUserId2(token.id, page, limit, order_by, order_type, []);
	rs.count = list.count;
	rs.data = list.rows;
	rs.page = +page;
	rs.total_page = getTotalPage(rs.count, limit);

	return res.json(rs);
};

module.exports.getOtherUserId = async (req, res) => {
	const { page, limit, order_by, order_type } = req.query;
	const user_id = req.params.id;
	const rs = {};
	const list = await rate_service.findAllByUserId2(user_id, page, limit, order_by, order_type, []);
	if (!rs) {
		return res.status(204).json({});
	}

	rs.count = list.count;
	rs.data = list.rows;
	rs.page = +page;
	rs.total_page = getTotalPage(rs.count, limit);

	return res.json(rs);
};

//bidder tạo đánh giá
module.exports.bidderCreateRate = async (req, res) => {
	const token = req.token;
	const { user_id_2, product_id, comment, point } = req.body;

	const check_duplicate = await rate_service.findAllByUserId1AndProductId(token.id, product_id);
	if (check_duplicate) {
		return res.status(400).json({ errs: [ http_message.status_400_rate_duplicate.message ] });
	}

	//nếu trong bảng trade mới cho đánh giá (bảng trade chỉ chứa bidder thắng cuộc)
	const check_winner = await trade_service.findByBidderIdAndProductId(token.id, product_id);
	if (!check_winner) {
		return res.status(400).json({ errs: [ http_message.status_400_not_win_bidder.message ] });
	}

	const rs = await rate_service.createNewRate(token.id, user_id_2, product_id, comment, point);

	return res.json(rs);
};
