const User = require('./user.model');
const random_helper = require('../../helpers/random.helper');
const bcrypt_helper = require('../../helpers/bcrypt.helper');
const moment = require('moment');

// SELECT
module.exports.findUserById = async (id) => {
	return await User.findByPk(id);
};

module.exports.findUserByEmail = async (email) => {
	return await User.findOne({
		where: { email: email }
	});
};

module.exports.findUserByCode = async (code) => {
	return await User.findOne({
		where: { code: code }
	});
};

// INSERT
module.exports.createNewUser = async (body, refresh_token) => {
	const { email, name, birth, address, password } = body;
	const rs = await this.findUserByEmail(email);
	if (rs) {
		return null;
	}

	const new_data = await User.create({
		email,
		name,
		birth: moment(birth, 'DD/MM/YYYY'), //trong mysql, date sẽ lưu YYYY-MM-DD
		address,
		code: await this.createNewCode(10),
		refresh_token,
		password: await bcrypt_helper.hash(password, 10)
	}).catch((err) => {
		console.log(err);
		return null;
	});

	return new_data;
};

// UPDATE
module.exports.updateRefreshToken = async (id, refresh_token) => {
	await User.update(
		{
			refresh_token
		},
		{
			where: {
				id
			}
		}
	);
};

// DELETE

// OTHERS
module.exports.createNewCode = async (length) => {
	let code = random_helper.makeRandomString(length);
	while (await this.findUserByCode(code)) {
		code = random_helper.makeRandomString(length);
	}
	return code;
};
