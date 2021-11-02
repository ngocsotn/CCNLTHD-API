const http_message = require('../../constants/http_message.constant');
const product_service = require('../../models/Product/Product.service');
const product_image_service = require('../../models/ProductImage/ProductImage.service');
const jwt_helper = require('../../helpers/jwt.helper');
const { getTotalPage } = require('../../helpers/etc.helper');

module.exports.ultimateSearchProduct = async (req, res) => {
	const token = jwt_helper.getPayloadFromHeaderToken(req) || { id: null };

	const { sub_category_id, keyword, page, limit, order_by, order_type, is_self } = req.query;

	const rs = {};
	const list = await product_service.getUltimate(
		sub_category_id,
		keyword,
		[],
		page,
		limit,
		order_by,
		order_type,
		is_self,
		token.id
	);

	rs.count = list.count || 0;
	rs.data = list.rows || [];
	rs.page = +page;
	rs.total_page = getTotalPage(rs.count, limit);

	//thêm ảnh hiển thị
	if (list) {
		for (const item of rs.data) {
			item.dataValues.images = await product_image_service.getImageListByProductId(item.product_id);
		}
	}

	return res.json(rs);
};

module.exports.getProductDetails = async (req, res) => {
	const product_id = req.params.id;

	const rs = await product_service.getProductDetails(product_id, []);
	if (rs) {
		rs.dataValues.images = await product_image_service.getImageListByProductId(rs.product_id);
	} else {
		return res.status(204).json({});
	}

	return res.json(rs);
};

module.exports.createProductPost = async (req, res) => {
	const token = req.token;
	const errs = [];
	const { start_price, step_price, buy_price } = req.body;

	if (start_price < 1000 || step_price < 1000 || (buy_price && buy_price < 1000)) {
		errs.push(http_message.status400_price.message);
	}
	if (buy_price && start_price >= buy_price) {
		errs.push(http_message.status400_buy_price.message);
	}
	if (step_price >= start_price) {
		errs.push(http_message.status400_step_price.message);
	}

	if (errs.length > 0) {
		return res.status(400).json({ errs });
	}

	const new_data = await product_service.createNewProduct(req.body, token.id);
	return res.json(new_data);
};

module.exports.appendProductDetail = async (req, res) => {
	const token = req.token;
	const { detail, product_id } = req.body;
	await product_service.updateAppendDetail(detail, product_id, token.id);
	const rs = await product_service.getProductDetails(product_id, []);
	return res.json(rs);
};

module.exports.deleteProduct = async (req, res) => {
	const product_id = req.params.id;
	await product_service.deleteProductFake(product_id);
	return res.json(http_message.status200);
};
