const subCategory_service = require('../../models/SubCategory/subCategory.service');
const http_message = require('../../constants/http_message.constant');
const product_service = require('../../models/Product/Product.service');
const { handlePagingResponse } = require('../../helpers/etc.helper');

module.exports.getByCategory = async (req, res) => {
	const { limit, page, category_id } = req.query;
	const list = await subCategory_service.getAllByCategoryId(category_id, [], page, limit);
	const rs = handlePagingResponse(list, page, limit);

	return res.json(rs);
};

module.exports.createSubCategoryPost = async (req, res) => {
	const { category_id, name } = req.body;
	const rs = await subCategory_service.createNewSubCategory(category_id, name);

	return res.json(rs);
};

module.exports.updateSubCategory = async (req, res) => {
	const { sub_category_id, name, category_id } = req.body;

	if (name) {
		await subCategory_service.updateName(name, sub_category_id);
	}
	if (category_id) {
		await subCategory_service.updateCategoryId(category_id, sub_category_id);
	}

	return res.json(http_message.status200);
};

module.exports.deleteSubCategory = async (req, res) => {
	const sub_category_id = req.params.id;
	const list = await product_service.getManyProductBySubCategory(sub_category_id, []);

	if (list.length > 0) {
		return res.status(400).json({ errs: [ http_message.status400_exist_product.message ] });
	}

	await subCategory_service.deleteSubCategory(sub_category_id);

	return res.json(http_message.status200);
};
