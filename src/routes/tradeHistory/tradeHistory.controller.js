const trade_history_service = require('../../models/TradeHistory/tradeHistory.service');
const user_service = require('../../models/user/user.service');
const rate_service = require('../../models/Rate/rate.service');
const { handlePagingResponse } = require('../../helpers/etc.helper');
const product_combiner = require('../product/product.combiner');
const http_message = require('../../constants/http_message.constant');

// bidder
module.exports.bidderGetTrade = async (req, res) => {
	const token = req.token;
	const { page, limit, status, order_type } = req.query;

	const list = await trade_history_service.findByBidderId(token.id, page, limit, status, order_type, 'create_at', []);
	let rs = handlePagingResponse(list, page, limit);
	rs = await product_combiner.getAllProductDetailsByIdArray(rs.data);

	return res.json(rs);
};

// seller
module.exports.sellerGetTrade = async (req, res) => {
	const token = req.token;
	const { page, limit, status, order_type } = req.query;

	const list = await trade_history_service.findBySellerId(token.id, page, limit, status, order_type, 'create_at', []);
	let rs = handlePagingResponse(list, page, limit);
	rs = await product_combiner.getAllProductDetailsByIdArray(rs.data);

	return res.json(rs);
};

module.exports.sellerPutStatus = async (req, res) => {
	const token = req.token;
	const { bidder_id, product_id, status, comment } = req.body;

	const check = await trade_history_service.findByProductIdAndStatus(product_id, 'pending');
	if (!check) {
		return res.status(400).json({ errs: [ http_message.status_400_trade_not_found.message ] });
	}

	//update vào rate và user
	if (status === 'accepted') {
		await rate_service.createNewRate(token.id, bidder_id, product_id, comment, +1);
		await user_service.updateIncreaseLike(bidder_id);
	} else {
		await rate_service.createNewRate(token.id, bidder_id, product_id, comment, -1);
		await user_service.updateIncreaseDislike(bidder_id);
	}

	// update vào trade
	await trade_history_service.updateStatusIsPending(bidder_id, token.id, product_id, status);

	return res.json(http_message.status200);
};
