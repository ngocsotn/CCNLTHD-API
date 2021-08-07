const db = require('../utils/db');

module.exports.login = async (username, password, refreshToken) => {
	const user = await db('user')
		.where({
			username,
			password
		})
		.first('id');
	if (user) {
		await db('user').where({ id: user.id }).update({ refreshToken });
		return user.id;
	}
	return null;
};

module.exports.verifyRefreshToken = async (id, refreshToken) => {
	const user = await db('user')
		.where({
			id,
			refreshToken
		})
		.first('id');
	if (user) return user.id;
	return null;
};

module.exports.getUserById = async (id) => {
	const user = db('user')
		.where({
			id
		})
		.first('username');

	if (user) return user;
	return null;
};
