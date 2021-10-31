const regex_pattern = require('../constants/regex_pattern.constant');

exports.loginSchema = {
	type: 'object',
	properties: {
		email: { type: 'string', pattern: regex_pattern.emailPattern },
		password: { type: 'string', minLength: 5 }
	},

	required: [ 'email', 'password' ],
	additionalProperties: false
};

exports.registerSchema = {
	type: 'object',
	properties: {
		email: { type: 'string', pattern: regex_pattern.emailPattern },
		password: { type: 'string', minLength: 5 },
		name: { type: 'string', minLength: 5 },
		address: { type: 'string', minLength: 5 },
		birth: { type: 'string', pattern: regex_pattern.datePattern }
	},

	required: [ 'email', 'password', 'name', 'address', 'birth' ],
	additionalProperties: false
};

exports.forgotSchema = {
	type: 'object',
	properties: {
		email: { type: 'string', pattern: regex_pattern.emailPattern }
	},

	required: [ 'email' ],
	additionalProperties: false
};

exports.recoverySchema = {
	type: 'object',
	properties: {
		password: { type: 'string', minLength: 5 },
		code: { type: 'string', minLength: 10 }
	},

	required: [ 'password', 'code' ],
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
