const jwt_helper = require('../../helpers/jwt.helper');
const bcrypt_helper = require('../../helpers/bcrypt.helper');
const http_message = require('../../constants/http_message.constant');
const user_service = require('../../models/user/user.service');

module.exports.profileGet = async (req, res) => {
	const payload = jwt_helper.getPayloadFromHeaderToken(req);
	const rs = await user_service.findUserById(payload.id, [ 'password', 'code', 'refresh_token' ]);

	return res.status(200).json(rs);
};

module.exports.profilePut = async (req, res) => {
	const payload = jwt_helper.getPayloadFromHeaderToken(req);
	const { name, email, address, birth, password, new_password } = req.body;
	const err_message = [];

	if (name) {
		await user_service.updateName(payload.id, name);
	}
	if (address) {
		await user_service.updateAddress(payload.id, address);
	}
	if (birth) {
		await user_service.updateBirth(payload.id, birth);
	}

	if (password && new_password) {
		if (new_password.length < 5) {
			err_message.push(http_message.status400_short_password.message);
		} else {
			const rs = await user_service.findUserById(payload.id, []);
			if (!await bcrypt_helper.verify(password, rs.password)) {
				err_message.push(http_message.status401_wrong_password.message);
			} else {
				await user_service.updatePassword(payload.id, new_password);
			}
		}
	}

	if (email) {
		const rs = await user_service.updateEmail(payload.id, email);
		if (!rs) {
			err_message.push(http_message.status401_conflict_email.message);
		}
	}

	return res.status(200).json({ message: http_message.status200.message, errs: err_message });
};
