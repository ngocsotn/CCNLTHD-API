const category_service = require('../../models/Category/category.service');
const subCategory_service = require('../../models/SubCategory/subCategory.service');
// const jwt_helper = require('../../helpers/jwt.helper');
const http_message = require('../../constants/http_message.constant');

module.exports.getCategory = async (req, res) => {
	const all_category = await category_service.getAll([]);
	const rs = { count: all_category.length, data: [] };

	for (const item of all_category) {
		const all_sub_category = await subCategory_service.getAllByCategoryId(item.category_id, [ 'category_id' ]);
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
	// kiểm tra category có danh mục con ko, có thì xóa luôn
	await category_service.deleteCategory(category_id);

	return res.json(http_message.status200);
};
