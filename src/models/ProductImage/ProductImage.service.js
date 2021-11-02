const ProductImage = require('./ProductImage.model');

// SELECT
module.exports.getImageListByProductId = async (product_id, exclude_arr = []) => {
	exclude_arr.push('id', 'full_cloud_id');

	const rs = await ProductImage.findAll({
		where: { product_id },
		attributes: { exclude: exclude_arr }
	});

	return rs;
};

// INSERT
module.exports.createNewProductImage = async (product_id, cloud_id, full_cloud_id, url) => {
	const new_data = await ProductImage.create({
		product_id,
		cloud_id,
		full_cloud_id,
		url
	}).catch((err) => {
		console.log(err);
		return null;
	});

	return new_data;
};

// DELETE
module.exports.deleteProductImage = async (cloud_id) => {
	await ProductImage.destroy({
		where: { cloud_id }
	}).catch((err) => {
		console.log(err);
	});
};

module.exports.deleteManyProductImageByProductId = async (product_id) => {
	await ProductImage.destroy({
		where: { product_id }
	}).catch((err) => {
		console.log(err);
	});
};
