const jwt_helper = require('../../helpers/jwt.helper');
const http_message = require('../../constants/http_message.constant');
const user_service = require('../../models/user/user.service');
const bcrypt_helper = require('../../helpers/bcrypt.helper');
const mailer_helper = require('../../helpers/mailer.helper');

module.exports.test = async (req, res) => {
	const html = await mailer_helper.replaceHTML(
		'Kích hoạt tài khoản',
		'Bạn vừa đăng ký thành công tài khoản, nhấn nút bên dưới để kích hoạt',
		'(hoặc có thể dùng mã: SD89hk9237FHker33)',
		'',
		'google.com'
	);

	await mailer_helper.send('Kích hoạt tài khoản', 'hepiha9413@datakop.com', 'user', html);

	return res.json('ok');
};

module.exports.registerPost = async (req, res) => {
	const refresh_token = jwt_helper.generateRefreshToken();
	const new_data = await user_service.createNewUser(req.body, refresh_token);
	if (!new_data) {
		return res.status(401).json(http_message.status401_conflict_email);
	}

	const token = jwt_helper.generateAccessToken({
		id: new_data.id,
		role: new_data.role,
		active: new_data.active
	});

	return res.json({ token, refresh_token: new_data.refresh_token });
};

module.exports.loginPost = async (req, res) => {
	const { email, password } = req.body;
	const rs = await user_service.findUserByEmail(email);
	if (!rs) {
		return res.status(400).json(http_message.status400_login_fail);
	}
	if (!await bcrypt_helper.verify(password, rs.password)) {
		return res.status(400).json(http_message.status400_login_fail);
	}

	const token = jwt_helper.generateAccessToken({
		id: rs.id,
		role: rs.role,
		active: rs.active
	});

	return res.json({ token, refresh_token: rs.refresh_token });
};

module.exports.refreshTokenPost = async (req, res) => {
	const { refresh_token } = req.body;
	const token = jwt_helper.getAccessTokenFromHeader(req);

	const rs = await jwt_helper.refreshAccessToken(token, refresh_token);
	if (rs === '1') {
		return res.status(401).json(http_message.status401_access_token);
	} else if (rs === '2') {
		return res.status(401).json(http_message.status401_refresh_token);
	}
	return res.json({ token: rs, refresh_token });
};

module.exports.getUsernameGet = async (req, res) => {
	// const token = myJWT.getAccessTokenFromHeader(req);
	// const payload = myJWT.verifyAccessToken(token);
	// const user = await modelSampleService.getUserById(payload.id);
	// return res.status(200).json(user);
};
