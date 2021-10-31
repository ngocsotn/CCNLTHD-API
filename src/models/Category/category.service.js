const category = require('./category.model');

// SELECT
module.exports.getAll = async (exclude_arr) => {
	return await category.findAll({
		attributes: { exclude: exclude_arr || [] }
	});
};

// INSERT
module.exports.createNewCategory = async (name) => {
	const new_data = await category
		.create({
			name
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	return new_data;
};

// UPDATE
module.exports.updateName = async (name, category_id) => {
	await category.update(
		{
			name
		},
		{
			where: { category_id }
		}
	);
};

// DELETE
module.exports.deleteCategory = async (category_id) => {
	await category
		.destroy({
			where: { category_id }
		})
		.catch((err) => {
			console.log(err);
		});
};
