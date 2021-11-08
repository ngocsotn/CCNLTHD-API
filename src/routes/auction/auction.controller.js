const product_service = require('../../models/Product/Product.service');
const auction_service = require('../../models/auction/auction.service');
const user_service = require('../../models/user/user.service');
const { handlePagingResponse, maskUsername } = require('../../helpers/etc.helper');
const http_message = require('../../constants/http_message.constant');
const moment = require('moment');
// moment().utcOffset('+07:00');

//public
// xem lịch sử ra giá của 1 sản phẩm nào đó
module.exports.getBiddingHistory = async (req, res) => {
	const { product_id, page, limit } = req.query;
	const list = await auction_service.getAllByProductId(product_id, page, limit, 'bid_at', 'DESC', []);
	const rs = handlePagingResponse(list, page, limit);

	for (const item of rs.data) {
		if (item.user_id) {
			const bidder = await user_service.findUserById(item.user_id, [ 'password', 'refresh_token' ]);
			item.dataValues.name = maskUsername(bidder.name);
		}
	}

	// const test = await auction_service.getSecondPlaceBidder(2, 1);
	// console.log(test);

	return res.json(rs);
};

//bidder
// xem danh sách sản phẩm đã, đang tham gia
module.exports.getSelfAreJoined = async (req, res) => {
	const token = req.token;
	const { page, limit } = req.query;

	const list = await auction_service.getAllDistinctByUserId(token.id, page, limit, 'bid_at', 'DESC', []);
	const rs = handlePagingResponse(list, page, limit);

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

	await product_service.updateBuyNow(product_id, token.id);
	await auction_service.createNewAuction(token.id, product_id, 'accepted', price);
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

	if (price % product.step_price !== 0) {
		return res.status(400).json({ errs: [ http_message.status_400_step_price_bid.message ] });
	}

	//nếu giá hiện tại >= giá mua ngay thì xong đấu giá
	if (price >= product.buy_price && product.buy_price > 1000) {
		await auction_service.createNewAuction(token.id, product_id, 'accepted', price);
		await product_service.updateShowPrice(product_id, price);
		// ...
	}

	if (price <= product.hidden_price) {
		if (price > product.price) {
			await auction_service.createNewAuction(token.id, product_id, 'accepted', price);
			await product_service.updateShowPrice(product_id, price);

			//Gửi socket...
		}

		return res.status(400).json({ errs: [ http_message.status_400_step_price_bid.message ] });
	}

	//nếu pass hết check
	await auction_service.createNewAuction(token.id, product_id, 'accepted', price);
	await product_service.updateHolderAndHiddenPrice(product_id, token.id, price);

	//Gửi socket...

	return res.json(http_message.status200);
};

const checkBidderValid = async (user_id, product_id) => {
	const bidder = await user_service.findUserById(user_id, []);

	if (bidder.point_dislike / (bidder.point_dislike + bidder.point_like) * 100 < 20) {
		return { errs: [ http_message.status_400_point_is_low.message ] };
	}

	const is_blocked = await auction_service.getUserByIdAndStatus(user_id, 'denied');

	if (is_blocked) {
		return { errs: [ http_message.status400_blocked_user.message ] };
	}

	const product = await product_service.getProductDetails(product_id, []);
	const now = moment().utcOffset('+07:00');

	if (now > moment(product.expire_at, 'DD/MM/YYYY HH:mm:ss')) {
		return { errs: [ http_message.status_400_bid_time_over.message ] };
	}

	return null;
};

//seller
module.exports.postBlockUser = async (req, res) => {
	const { user_id, product_id } = req.body;
	await auction_service.updateStatus(user_id, product_id, 'denied');

	// lấy product kiểm tra xem holder id trùng không
	const product = await product_service.getProductDetails(product_id, []);

	//thay thế nếu đó là holder cao nhất hiện tại trong product, thay user 2nd || null
	if (+product.bidder_id === +user_id) {
		const second_bidder = await auction_service.getSecondPlaceBidder(user_id, product_id);

		if (second_bidder) {
			await product_service.updateHolderAndHiddenPrice(product_id, second_bidder.user_id, second_bidder.price);
		} else {
			await product_service.updateHolderAndHiddenPrice(product_id, null, product.start_price);
		}
	}

	return res.json(http_message.status200);
};
