const category_service = require('../../models/Category/category.service');
const subCategory_service = require('../../models/SubCategory/subCategory.service');
const { handlePagingResponse } = require('../../helpers/etc.helper');
const http_message = require('../../constants/http_message.constant');

module.exports.getNestedCategory = async (req, res) => {
	const list = await category_service.getAll([]);
	const all_category = list.rows;
	const rs = { count: all_category.length, data: [] };

	for (const item of all_category) {
		const list = await subCategory_service.getAllByCategoryId(item.category_id, []);
		const all_sub_category = list.rows;
		const item_category = {
			category_id: item.category_id,
			name: item.name,
			count: all_sub_category.length,
			data: []
		};

		for (const sub_item of all_sub_category) {
			item_category.data.push(sub_item);
		}
		rs.data.push(item_category);
	}

	return res.json(rs);
};

module.exports.getCategory = async (req, res) => {
	const { page, limit } = req.query;
	const list = await category_service.getAll([], page, limit);
	const rs = handlePagingResponse(list, page, limit);

	return res.json(rs);
};

module.exports.createCategoryPost = async (req, res) => {
	const { name } = req.body;
	const rs = await category_service.createNewCategory(name);

	return res.json(rs);
};

module.exports.updateCategoryName = async (req, res) => {
	const { name, category_id } = req.body;
	await category_service.updateName(name, category_id);

	return res.json(http_message.status200);
};

module.exports.deleteCategory = async (req, res) => {
	const category_id = req.params.id;
	const list = await subCategory_service.getAllByCategoryId(category_id, [], 1, 99999999999);

	if (list.rows.length > 0) {
		return res.status(400).json({ errs: [ http_message.status400_exist_sub_category.message ] });
	}

	await category_service.deleteCategory(category_id);

	return res.json(http_message.status200);
};
