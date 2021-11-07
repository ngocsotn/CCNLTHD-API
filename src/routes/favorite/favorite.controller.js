const favorite_service = require('../../models/Favorite/favorite.service');
const { handlePagingResponse } = require('../../helpers/etc.helper');
const http_message = require('../../constants/http_message.constant');
const product_combiner = require('../product/product.combiner');

module.exports.getSelfFavorite = async (req, res) => {
	const token = req.token;
	const { page, limit, order_type } = req.query;

	const list = await favorite_service.findAllByUserId(token.id, page, limit, 'id', order_type, []);
	let rs = handlePagingResponse(list, page, limit);

	// thêm thông tin sản phẩm chi tiết vào cho từng item...
	rs = await product_combiner.getAllProductDetailsByIdArray(rs.data);

	return res.json(rs);
};

module.exports.createFavorite = async (req, res) => {
	const token = req.token;
	const { product_id } = req.body;
	const check_exist = await favorite_service.findByUserIdAndProductId(token.id, product_id);
	if (check_exist) {
		return res.status(400).json({ errs: [ http_message.status_400_favorite_duplicate.message ] });
	}

	const rs = await favorite_service.createNewFavorite(token.id, product_id);
	// thêm thông tin sản phẩm chi tiết vào cho từng item...

	return res.json(rs);
};

module.exports.deleteFavorite = async (req, res) => {
	const token = req.token;
	const product_id = req.params.id;
	await favorite_service.deleteFavorite(token.id, product_id);

	return res.json(http_message.status200);
};
