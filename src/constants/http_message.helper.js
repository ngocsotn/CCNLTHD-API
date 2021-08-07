// 200
exports.status204 = {
	message: 'Content can not be found!'
};

// 300
exports.status304 = {
	message: 'Nothing modified'
};
// 400
exports.status400 = {
	message: 'Bad request! please read the API document!'
};

exports.status401_login_fail = {
	message: 'Login failed'
};

exports.status401_access_token = {
	message: 'Invalid access token'
};

exports.status401_refresh_token = {
	message: 'Invalid refresh token'
};

exports.status403 = {
	message: 'Do not have access'
};

exports.status404 = {
	message: 'Endpoint not found!'
};

// 500
exports.status500 = {
	message: 'Server Error: Server can not handle that!'
};
