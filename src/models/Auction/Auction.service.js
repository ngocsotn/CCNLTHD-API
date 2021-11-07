const Auction = require('./auction.model');
const moment = require('moment');
const Op = require('sequelize').Op;
// moment().utcOffset('+07:00');

// SELECT

// nếu status = denied => ko được bid
module.exports.getUserByIdAndStatus = async (user_id, status = 'accepted') => {
	const rs = await Auction.findOne({
		where: { user_id, status }
	});

	return rs;
};

module.exports.getCountUserByProductId = async (product_id) => {
	const rs = await Auction.count({
		distinct: true,
		col: 'user_id',
		where: { product_id }
	});

	return rs;
};

module.exports.getManyByUserIdAndProductId = async (
	user_id,
	product_id,
	exclude_arr,
	order_by = 'bid_at',
	order_type = 'DESC'
) => {
	const rs = await Auction.findAndCountAll({
		where: { user_id, product_id },
		attributes: {
			exclude: exclude_arr
		},
		order: [ [ order_by, order_type ] ]
	});

	return rs;
};

// tìm người giữ giá thứ 2 khác người đang top (bị block)
module.exports.getSecondPlaceBidder = async (top_bidder, product_id) => {};

// INSERT
module.exports.createNewAuction = async (user_id, product_id, status, price) => {
	const new_data = await Auction.create({
		user_id,
		product_id,
		status,
		price,
		bid_at: moment().utcOffset(60 * 7).format('YYYY-MM-DD HH:mm:ss')
	}).catch((err) => {
		console.log(err);
		return null;
	});

	return new_data;
};

// UPDATE

//update để chặn user bid tiếp cái sản phẩm X
module.exports.updateStatus = async (user_id, product_id, status = 'accepted') => {
	//chỉ update cái bid gần nhất
	const rs = await this.getManyByUserIdAndProductId(user_id, product_id, [], 'bid_at', 'DESC');

	await Auction.update(
		{
			status
		},
		{
			where: {
				id: rs[0].id
			}
		}
	);
};

// DELETE
