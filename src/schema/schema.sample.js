exports.loginSchema = {
	type: 'object',
	properties: {
		username: { type: 'string', minLength: 1 },
		password: { type: 'string', minLength: 1 }
	},

	required: [ 'username', 'password' ],
	additionalProperties: false
};

exports.refreshTokenSchema = {
	type: 'object',
	properties: {
		accessToken: { type: 'string', minLength: 1 },
		refreshToken: { type: 'string', minLength: 1 }
	},

	required: [ 'accessToken', 'refreshToken' ],
	additionalProperties: false
};
