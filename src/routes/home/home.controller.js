const product_service = require('../../models/Product/Product.service');
const { handlePagingResponse } = require('../../helpers/etc.helper');
const product_combiner = require('../product/product.combiner');

module.exports.getSelfHistory = async (req, res) => {
	const rs = {};

	// 5 sản phẩm có giá cao nhất
	const list_price = await product_service.getUltimate(null, null, [], 1, 5, 'price', 'DESC', 0, null, 0, 'on');
	if (list_price) {
		rs.price = await product_combiner.addFieldForArrayProduct(list_price.rows);
	}

	// 5 sản phẩm gần expire
	const list_expire = await product_service.getUltimate(null, null, [], 1, 5, 'expire_at', 'ASC', 0, null, 0, 'on');
	if (list_expire) {
		rs.expire = await product_combiner.addFieldForArrayProduct(list_expire.rows);
	}

	// 5 sản phẩm có lượt bid nhiều nhất
	const list_bid = await product_service.getUltimate(null, null, [], 1, 5, 'bid_count', 'DESC', 0, null, 0, 'on');
	if (list_bid) {
		rs.bid_count = await product_combiner.addFieldForArrayProduct(list_bid.rows);
	}

	return res.json(rs);
};
