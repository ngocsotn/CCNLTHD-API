const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Product = require('./product.model');
const moment = require('moment');
moment().utcOffset('+07:00');

// SELECT
module.exports.getProductDetails = async (product_id, exclude_arr) => {
	return await Product.findOne({
		where: { product_id, delete: false },
		attributes: { exclude: exclude_arr || [] }
	});
};

module.exports.getUltimate = async (
	sub_category_id = null,
	keyword = '',
	exclude_arr = [],
	page = 0,
	limit = 999999999,
	order_by = 'product_id',
	order_type = 'ASC'
) => {
	sub_category_id = !sub_category_id ? { [Op.ne]: null } : sub_category_id;
	exclude_arr.push('delete');
	if (keyword) {
		keyword = keyword.split(' ').join(',');
	}
	const rs = await Product.findAndCountAll({
		where: [
			{
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
		offset: +page * +limit,
		limit: +limit,
		order: [ [ order_by, order_type ] ]
	});

	return rs;
};

module.exports.getManyProductBySubCategory = async (sub_category_id, exclude_arr, page = null, limit = null) => {
	if (page !== null && page < 1) {
		throw Error('Trang phải lớn hơn 0');
	}

	if (!limit) {
		return Product.findAll({
			where: { sub_category_id, delete: false },
			attributes: { exclude: exclude_arr || [] }
		});
	}

	return Product.findAll({
		where: { sub_category_id, delete: false },
		attributes: { exclude: exclude_arr || [] },
		offset: (page - 1) * limit,
		limit
	});
};

// INSERT
module.exports.createNewProduct = async (body, user_id) => {
	const { sub_category_id, name, auto_extend, detail, start_price, step_price, buy_price, expire_at } = body;

	const new_data = await Product.create({
		user_id,
		sub_category_id,
		name,
		auto_extend,
		detail,
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
module.exports.updateAppendDetail = async (new_detail, product_id) => {
	const rs = await this.getProductDetails(product_id, []);
	const appended_detail = rs.detail + '\n✏️ ' + moment().format('DD/MM/YYYY HH:mm:ss') + '\n' + new_detail;

	await Product.update(
		{
			detail: appended_detail
		},
		{
			where: { product_id }
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
