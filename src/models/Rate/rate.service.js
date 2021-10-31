const rate = require('./rate.model');
const moment = require('moment');
moment().utcOffset('+07:00');

// SELECT
module.exports.getActiveRate = async (id, exclude_arr) => {
	const rs = await rate.findAll({
		where: { user_id_1: id },
		attributes: { exclude: exclude_arr || [] }
	});

	return rs;
};

module.exports.getPassiveRate = async (id, exclude_arr) => {
	const rs = await rate.findAll({
		where: { user_id_2: id },
		attributes: { exclude: exclude_arr || [] }
	});

	return rs;
};

// INSERT
module.exports.createNewRate = async (body) => {
	const { user_id_1, user_id_2, product_id, comment, point } = body;
	const new_data = await rate
		.create({
			user_id_1,
			user_id_2,
			product_id,
			comment,
			point
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	return new_data;
};

// UPDATE

// DELETE
