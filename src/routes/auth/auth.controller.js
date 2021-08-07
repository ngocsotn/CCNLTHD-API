const myJWT = require('../../helpers/jwt.helper');
const modelSampleService = require('../../models/model.sample');
const httpMessage = require('../../constants/http_message.helper');

module.exports.loginPost = async (req, res) => {
	const { username, password } = req.body;
	const refreshToken = myJWT.generateRefreshToken();
	const id = await modelSampleService.login(username, password, refreshToken);
	if (id) {
		const accessToken = myJWT.generateAccessToken({ id });
		return res.json({
			accessToken,
			refreshToken
		});
	}

	return res.status(401).json(httpMessage.status401_login_fail);
};

module.exports.refreshTokenPost = async (req, res) => {
	const { accessToken, refreshToken } = req.body;
	const rs = await myJWT.refreshAccessToken(accessToken, refreshToken);

	if (rs === '1') {
		return res.status(401).json(httpMessage.status401_access_token);
	} else if (rs === '2') {
		return res.status(401).json(httpMessage.status401_refresh_token);
	}
	return res.json({ accessToken: rs });
};

module.exports.getUsernameGet = async (req, res) => {
	const accessToken = myJWT.getAccessTokenFromHeader(req);
	const payload = myJWT.verifyAccessToken(accessToken);
	const user = await modelSampleService.getUserById(payload.id);
	return res.status(200).json(user);
};
