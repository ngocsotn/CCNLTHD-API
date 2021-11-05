const TradeHistory = require('./tradeHistory.model');
const moment = require('moment');
moment().utcOffset('+07:00');

// SELECT
module.exports.findByBidderId = async (
	bidder_id = 0,
	page = 1,
	limit = 1,
	status = null,
	order_type = 'create_at',
	order_by = 'DESC',
	exclude_arr = []
) => {
	page = page ? page : 1;
	limit = limit ? limit : 999999999;
	status = status ? status : { [Op.ne]: null };

	return await TradeHistory.findAndCountAll({
		where: {
			status,
			bidder_id
		},
		attributes: { exclude: exclude_arr },
		offset: (+page - 1) * +limit,
		limit: +limit,
		order: [ [ order_by, order_type ] ]
	});
};

module.exports.findBySellerId = async (
	seller_id = 0,
	page = 1,
	limit = 1,
	status = null,
	order_type = 'create_at',
	order_by = 'DESC',
	exclude_arr = []
) => {
	page = page ? page : 1;
	limit = limit ? limit : 999999999;
	status = status ? status : { [Op.ne]: null };

	return await TradeHistory.findAndCountAll({
		where: {
			status,
			seller_id
		},
		attributes: { exclude: exclude_arr },
		offset: (+page - 1) * +limit,
		limit: +limit,
		order: [ [ order_by, order_type ] ]
	});
};

module.exports.findByBidderIdAndProductId = async (bidder_id, product_id) => {
	return await TradeHistory.findOne({
		where: {
			bidder_id,
			product_id
		}
	});
};

// INSERT
module.exports.createNewTrade = async (bidder_id, seller_id, product_id, status = 'pending') => {
	const new_data = await TradeHistory.create({
		bidder_id,
		seller_id,
		product_id,
		status,
		create_at: moment().format('DD/MM/YYYY HH:mm:ss')
	}).catch((err) => {
		console.log(err);
		return null;
	});

	return new_data;
};

// UPDATE

// DELETE
