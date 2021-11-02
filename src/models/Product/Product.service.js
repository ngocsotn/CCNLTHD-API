const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Product = require('./product.model');
const moment = require('moment');
moment().utcOffset('+07:00');

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
	order_by = 'product_id',
	order_type = 'ASC',
	is_self = 0,
	seller_id = null
) => {
	page = page > 0 ? page : 1;
	sub_category_id = sub_category_id ? sub_category_id : { [Op.ne]: null };
	seller_id = +is_self === 1 ? seller_id : { [Op.ne]: null };
	seller_id = seller_id ? seller_id : { [Op.ne]: null };
	keyword = keyword ? keyword.split(' ').join(',') : '';
	exclude_arr.push('delete');

	const rs = await Product.findAndCountAll({
		where: [
			{
				seller_id,
				sub_category_id,
				delete: false
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
		expire_at: moment(expire_at, 'DD/MM/YYYY HH:mm:ss')
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
