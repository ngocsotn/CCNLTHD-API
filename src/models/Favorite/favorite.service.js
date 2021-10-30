const Favorite = require('./favorite.model');

module.exports.findFavoriteListByUserId = async (user_id) => {
	const rs = await Favorite.findAll({
		where: {
			user_id: user_id
		}
	});

	return rs;
};
