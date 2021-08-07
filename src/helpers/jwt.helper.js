const jwt = require('jsonwebtoken');
const myRandom = require('../helpers/random.helper');
const modelSampleService = require('../models/model.sample');

const opts = {
	expiresIn: +process.env.JWT_LIVE_MINUTES * 60 //seconds
};

module.exports.getAccessTokenFromHeader = (req) => {
  return req.headers[process.env.JWT_HEADER];
}

module.exports.generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY, opts);
};

module.exports.generateRefreshToken = () => {
	return myRandom.makeRandomString(50);
};

module.exports.verifyAccessToken = (accessToken) => {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
		return decoded;
	} catch (err) {
		return null;
	}
};

module.exports.refreshAccessToken = async (oldAccessToken, refreshToken) => {
	let payload = null;
	try {
		payload = jwt.verify(oldAccessToken, process.env.JWT_SECRET_KEY, {
			ignoreExpiration: true
		});
	} catch (err) {
		return '1'; //access token error
	}
	if ((await modelSampleService.verifyRefreshToken(payload.id, refreshToken)) !== null) {
		return this.generateAccessToken({ id: payload.id });
	} else {
		return '2'; //refresh token error
	}
};
