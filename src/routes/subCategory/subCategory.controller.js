const subCategory_service = require('../../models/SubCategory/subCategory.service');
const http_message = require('../../constants/http_message.constant');

module.exports.getByCategory = async (req, res) => {
	return res.json('ok');
};

module.exports.createSubCategoryPost = async (req, res) => {
	const { category_id, name } = req.body;
	const rs = await subCategory_service.createNewSubCategory(category_id, name);

	return res.json(rs);
};

module.exports.updateSubCategory = async (req, res) => {
	const { sub_category_id, name, category_id } = req.body;

  if(name) {
    await subCategory_service.updateName(name, sub_category_id);
  }
  if(category_id) {
    await subCategory_service.updateCategoryId(category_id, sub_category_id);
  }

	return res.json(http_message.status200);
};

module.exports.deleteSubCategory = async (req, res) => {
	const sub_category_id = req.params.id;
	await subCategory_service.deleteSubCategory(sub_category_id);

	return res.json(http_message.status200);
};
