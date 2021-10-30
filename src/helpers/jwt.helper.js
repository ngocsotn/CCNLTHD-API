const jwt = require('jsonwebtoken');
const myRandom = require('../helpers/random.helper');
const user_service = require('../models/user/user.service');

const opts = {
	expiresIn: +process.env.JWT_LIVE_MINUTES * 60 //seconds
};

module.exports.getAccessTokenFromHeader = (req) => {
	return req.headers[process.env.JWT_HEADER];
};

module.exports.generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY, opts);
};

module.exports.generateRefreshToken = () => {
	return myRandom.makeRandomString(50);
};

module.exports.verifyAccessToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		return decoded;
	} catch (err) {
		return null;
	}
};

module.exports.refreshAccessToken = async (token, refresh_token) => {
	let payload = null;
	try {
		payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
			ignoreExpiration: true
		});
	} catch (err) {
		return '1'; //access token error
	}
	const rs = await user_service.findUserById(payload.id);
	if (!rs) {
		return '1';
	}

	if (rs.refresh_token === refresh_token) {
		return this.generateAccessToken({ id: payload.id });
	} else {
		return '2'; //refresh token error
	}
};
