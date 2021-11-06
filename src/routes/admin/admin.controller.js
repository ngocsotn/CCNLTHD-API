const user_service = require('../../models/user/user.service');
const http_message = require('../../constants/http_message.constant');
const { handlePagingResponse } = require('../../helpers/etc.helper');

module.exports.getAllUser = async (req, res) => {
	const { limit, page } = req.query;
	const list = await user_service.getAllUser([ 'password', 'code', 'refresh_token' ], page, limit);
	const rs = handlePagingResponse(list, page, limit);

	return res.json(rs);
};

module.exports.getUserDetails = async (req, res) => {
	const user_id = req.params.id;
	const rs = await user_service.findUserById(user_id, [ 'password', 'code', 'refresh_token' ]);
	if (!rs) {
		return res.status(204).json({});
	}

	return res.json(rs);
};

module.exports.updateUser = async (req, res) => {
	const { birth, email, name, address, user_id } = req.body;
	const err_message = [];

	if (name) {
		await user_service.updateName(user_id, name);
	}
	if (address) {
		await user_service.updateAddress(user_id, address);
	}
	if (birth) {
		await user_service.updateBirth(user_id, birth);
	}
	if (email) {
		const rs = await user_service.updateEmail(user_id, email);
		if (!rs) {
			err_message.push(http_message.status401_conflict_email.message);
		}
	}

	return res.status(200).json({ message: http_message.status200.message, errs: err_message });
};
