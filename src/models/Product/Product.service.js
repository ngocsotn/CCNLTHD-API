const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Product = require('./product.model');
const moment = require('moment');
//moment().utcOffset('+07:00');

// console.log(moment().format('DD/MM/YYYY HH:mm:ss'));
// const test = moment().utcOffset('+07:00').format('DD/MM/YYYY HH:mm:ss');
// console.log(test);
// console.log(moment(test, 'DD/MM/YYYY HH:mm:ss').utcOffset('+00:00').format('DD/MM/YYYY HH:mm:ss'));
// console.log(moment(test, 'DD/MM/YYYY HH:mm:ss').utcOffset('+07:00').format('DD/MM/YYYY HH:mm:ss'));

// SELECT
module.exports.getProductDetails = async (product_id, exclude_arr = []) => {
	exclude_arr.push('delete');
	return await Product.findOne({
		where: { product_id, delete: false },
		attributes: { exclude: exclude_arr || [] }
	});
};

module.exports.getUltimate = async (
	sub_category_id = null,
	keyword = '',
	exclude_arr = [],
	page = 1,
	limit = 999999999,
	order_by = 'create_at',
	order_type = 'DESC',
	is_self = 0,
	seller_id = null,
	is_expire = 0,
	status = 'on'
) => {
	page = page > 0 ? page : 1;
	sub_category_id = sub_category_id ? sub_category_id : { [Op.ne]: null };
	seller_id = +is_self === 1 ? seller_id : { [Op.ne]: null };
	seller_id = seller_id ? seller_id : { [Op.ne]: null };
	keyword = keyword ? keyword.split(' ').join(',') : '';
	status = status ? status : { [Op.ne]: null };

	exclude_arr.push('delete');

	const now = +is_expire === 0 ? moment().utcOffset(60 * 7) : moment('01/01/2021 00:00:00', 'DD/MM/YYYY HH:mm:ss');

	const rs = await Product.findAndCountAll({
		where: [
			{
				seller_id,
				sub_category_id,
				delete: false,
        status,
				expire_at: {
					[Op.gt]: now //greater than
				}
			},
			keyword && Sequelize.literal('MATCH (name) AGAINST (:keyword IN NATURAL LANGUAGE MODE)')
		],
		replacements: {
			keyword: keyword
		},
		attributes: {
			exclude: exclude_arr
		},
		offset: (+page - 1) * +limit,
		limit: +limit,
		order: [ [ order_by, order_type ] ]
	});

	return rs;
};

module.exports.getManyProductBySubCategory = async (sub_category_id, exclude_arr) => {
	return await Product.findAll({
		where: { sub_category_id, delete: false },
		attributes: { exclude: exclude_arr || [] }
	});
};

// INSERT
module.exports.createNewProduct = async (body, seller_id) => {
	const { sub_category_id, name, auto_extend, detail, start_price, step_price, buy_price, expire_at } = body;

	const new_data = await Product.create({
		seller_id,
		sub_category_id,
		name,
		auto_extend,
		detail,
		price: start_price,
		hidden_price: start_price,
		start_price,
		step_price,
		buy_price,
		expire_at: moment(expire_at, 'DD/MM/YYYY HH:mm:ss'),
		create_at: moment().utcOffset(60 * 7).format('YYYY-MM-DD HH:mm:ss')
	}).catch((err) => {
		console.log(err);
		return null;
	});

	return new_data;
};

// UPDATE (chỉ được append detail)
module.exports.updateAppendDetail = async (new_detail, product_id, seller_id) => {
	const rs = await this.getProductDetails(product_id, []);
	const appended_detail = rs.detail + '\n✏️ ' + moment().format('DD/MM/YYYY HH:mm:ss') + '\n' + new_detail;

	await Product.update(
		{
			detail: appended_detail
		},
		{
			where: { product_id, seller_id }
		}
	);
};

module.exports.updateShowPrice = async (product_id, price) => {
	await Product.update(
		{
			price
		},
		{
			where: { product_id }
		}
	);
};

module.exports.updateHolderAndHiddenPrice = async (product_id, user_id, hidden_price) => {
	const rs = await this.getProductDetails(product_id, []);
	const price = Math.min(hidden_price, rs.hidden_price + rs.step_price);

	await Product.update(
		{
			bidder_id: user_id,
			hidden_price: hidden_price,
			price: price
		},
		{
			where: { product_id }
		}
	);
};

module.exports.updateProductStatus = async (product_id, status = 'off') => {
	await Product.update(
		{
			status
		},
		{ where: { product_id } }
	);
};

module.exports.updateBuyNow = async (product_id, user_id) => {
	const rs = await this.getProductDetails(product_id, []);

	await Product.update(
		{
			bidder_id: user_id,
			price: rs.buy_price,
			hidden_price: rs.buy_price,
			status: 'off'
		},
		{
			where: { product_id }
		}
	);
};

module.exports.updateJoinCount = async (product_id, new_count = 0) => {
	await Product.update(
		{
			join_count: new_count
		},
		{
			where: { product_id }
		}
	);
};

module.exports.updateIncreaseBidCount = async (product_id) => {
	const rs = await this.getProductDetails(product_id, []);

	if (rs.product_id) {
		await Product.update(
			{
				bid_count: rs.bid_count + 1
			},
			{
				where: { product_id }
			}
		);
	}
};
// DELETE (fake delete)
module.exports.deleteProductFake = async (product_id) => {
	await Product.update(
		{
			delete: true
		},
		{
			where: { product_id }
		}
	);
};

// OTHERS
