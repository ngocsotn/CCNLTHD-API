const Favorite = require('./favorite.model');

// SELECT
module.exports.findAllByUserId = async (
	user_id,
	page = 1,
	limit = 9999999,
	order_by = 'id',
	order_type = 'DESC',
	exclude_arr = []
) => {
	page = page ? page : 1;
	limit = limit ? limit : 999999999;

	return await Favorite.findAndCountAll({
		where: { user_id },
		attributes: { exclude: exclude_arr },
		offset: (+page - 1) * +limit,
		limit: +limit,
		order: [ [ order_by, order_type ] ]
	});
};

module.exports.findByUserIdAndProductId = async (user_id, product_id) => {
	return await Favorite.findOne({
		where: {
			user_id,
			product_id
		}
	});
};

// INSERT
module.exports.createNewFavorite = async (user_id, product_id) => {
	const new_data = await Favorite.create({
		user_id,
		product_id
	}).catch((err) => {
		console.log(err);
		return null;
	});

	return new_data;
};

// DELETE
module.exports.deleteFavorite = async (user_id, product_id) => {
	await Favorite.destroy({
		where: { user_id, product_id }
	}).catch((err) => {
		console.log(err);
	});
};
