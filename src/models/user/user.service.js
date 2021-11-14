const User = require('./user.model');
const random_helper = require('../../helpers/random.helper');
const bcrypt_helper = require('../../helpers/bcrypt.helper');
const Op = require('sequelize').Op;
const moment = require('moment');
// moment().utcOffset('+07:00');

module.exports.getAllUser = async (exclude_arr = [], page = 1, limit = 9999999) => {
	page = page ? page : 1;
	limit = limit ? limit : 9999999999;

	return User.findAndCountAll({
		attributes: { exclude: exclude_arr },
		offset: (+page - 1) * +limit,
		limit: +limit
	});
};

// SELECT
module.exports.findUserById = async (id, exclude_arr) => {
	return await User.findOne({
		where: { id },
		attributes: { exclude: exclude_arr || [] }
	});
};

module.exports.findUserByEmail = async (email, exclude_arr) => {
	return await User.findOne({
		where: { email },
		attributes: { exclude: exclude_arr || [] }
	});
};

module.exports.findUserByCode = async (code, exclude_arr) => {
	return await User.findOne({
		where: { code },
		attributes: { exclude: exclude_arr || [] }
	});
};

// INSERT
module.exports.createNewUser = async (body, refresh_token, is_admin) => {
	const { email, name, birth, address, password } = body;
	const rs = await this.findUserByEmail(email, []);
	if (rs) {
		return null;
	}

	const new_data = await User.create({
		email,
		name,
		birth: birth ? moment(birth, 'DD/MM/YYYY').format('YYYY-MM-DD') : null, //trong mysql, date sẽ lưu YYYY-MM-DD HH:mm:ss
		address,
		code: is_admin ? '' : await this.createNewCode(10),
		refresh_token,
		password: await bcrypt_helper.hash(password, 10),
		active: is_admin,
		role: is_admin ? 'admin' : 'bidder'
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

module.exports.updateCode = async (id, code) => {
	await User.update(
		{
			code
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updateActive = async (id, active) => {
	await User.update(
		{
			active
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updatePassword = async (id, password) => {
	await User.update(
		{
			password: await bcrypt_helper.hash(password, 10)
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updateName = async (id, name) => {
	await User.update(
		{
			name
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updateBirth = async (id, birth) => {
	await User.update(
		{
			birth: moment(birth, 'DD/MM/YYYY').format('YYYY-MM-DD')
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updateAddress = async (id, address) => {
	await User.update(
		{
			address
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updateRole = async (id, role) => {
	await User.update(
		{
			role
		},
		{
			where: {
				id
			}
		}
	);
};

module.exports.updateEmail = async (id, email) => {
	const rs = await this.findUserById(id, []);
	const rs_2 = await this.findUserByEmail(email, []);

	if (rs.email === email) {
		return rs;
	} else if (!rs_2 && rs.email !== email) {
		await User.update(
			{
				email
			},
			{
				where: {
					id
				}
			}
		);

		return rs;
	} else {
		return null;
	}
};

module.exports.updateIncreaseLike = async (id) => {
	const rs = await this.findUserById(id, []);
	await User.update(
		{
			point_like: rs.point_like + 1
		},
		{
			where: { id }
		}
	);
};

module.exports.updateIncreaseDislike = async (id) => {
	const rs = await this.findUserById(id, []);
	await User.update(
		{
			point_dislike: rs.point_dislike + 1
		},
		{
			where: { id }
		}
	);
};

// DELETE

// OTHERS
module.exports.createNewCode = async (length) => {
	let code = random_helper.makeRandomString(length);
	while (await this.findUserByCode(code, [])) {
		code = random_helper.makeRandomString(length);
	}
	return code;
};
