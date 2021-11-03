const jwt_helper = require('../../helpers/jwt.helper');
const http_message = require('../../constants/http_message.constant');
const user_service = require('../../models/user/user.service');
const bcrypt_helper = require('../../helpers/bcrypt.helper');
const mailer_helper = require('../../helpers/mailer.helper');
const read_env_array = require('../../helpers/setting_reader.helper').readEnvArray;
const admin_list = read_env_array(process.env.ADMIN_EMAIL);

module.exports.registerPost = async (req, res) => {
	const is_admin = admin_list.includes(req.body.email);
	const refresh_token = jwt_helper.generateRefreshToken();
	const rs = await user_service.createNewUser(req.body, refresh_token, is_admin);
	if (!rs) {
		return res.status(400).json({ errs: [ http_message.status400_conflict_email.message ] });
	}

	const token = jwt_helper.generateAccessToken({
		id: rs.id,
		role: rs.role,
		active: rs.active
	});

	if (rs.role !== 'admin') {
		//tạo và gửi mail kích hoạt
		const html = await mailer_helper.replaceHTML(
			'Kích hoạt tài khoản',
			`Chào ${rs.name}, hãy nhấn nút bên dưới để kích hoạt tài khoản.`,
			`(hoặc có thể dùng mã: ${rs.code})`,
			'KÍCH HOẠT',
			`${process.env.CLIENT_URL}/confirm-email?code=${rs.code}`
		);

		await mailer_helper.send('Kích hoạt tài khoản', rs.email, rs.name, html);
	}

	return res.json({ token, refresh_token: rs.refresh_token });
};

module.exports.loginPost = async (req, res) => {
	const { email, password } = req.body;
	const rs = await user_service.findUserByEmail(email, []);
	if (!rs) {
		return res.status(400).json({ errs: [ http_message.status400_login_fail.message ] });
	}
	if (!await bcrypt_helper.verify(password, rs.password)) {
		return res.status(400).json({ errs: [ http_message.status400_login_fail.message ] });
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

module.exports.verifyAccount = async (req, res) => {
	const { code } = req.query || -1;
	const rs = await user_service.findUserByCode(code, []);
	if (!rs) {
		return res.status(400).json({ errs: [ http_message.status400.message ] });
	}
	await user_service.updateCode(rs.id, '');
	await user_service.updateActive(rs.id, 1);

	const token = jwt_helper.generateAccessToken({
		id: rs.id,
		role: rs.role,
		active: 1
	});

	return res.json({ token, refresh_token: rs.refresh_token });
};

module.exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	const rs = await user_service.findUserByEmail(email, []);
	if (!rs) {
		return res.status(400).json({ errs: [ http_message.status400_not_exist_email.message ] });
	}
	const code = await user_service.createNewCode(10);
	await user_service.updateCode(rs.id, code);

	//gửi email
	const html = await mailer_helper.replaceHTML(
		'Khôi khục mật khẩu',
		`Chào ${rs.name}, hãy nhấn nút bên dưới để tiến hành tạo mật khẩu mới.`,
		``,
		'KHÔI PHỤC',
		`${process.env.CLIENT_URL}/reset-password?code=${rs.code}`
	);

	await mailer_helper.send('Khôi khục mật khẩu', rs.email, rs.name, html);

	return res.json(http_message.status200);
};

module.exports.recoveryPassword = async (req, res) => {
	const { code, password } = req.body;

	const rs = await user_service.findUserByCode(code, []);
	if (!rs) {
		return res.status(400).json({ errs: [ http_message.status400.message ] });
	}

	await user_service.updateCode(rs.id, '');
	await user_service.updateActive(rs.id, 1);
	await user_service.updatePassword(rs.id, password);

	const token = jwt_helper.generateAccessToken({
		id: rs.id,
		role: rs.role,
		active: 1
	});

	return res.json({ token, refresh_token: rs.refresh_token });
};
