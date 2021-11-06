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

	required: [ 'email', 'password', 'name', 'address' ],
	additionalProperties: true
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
		refresh_token: { type: 'string', minLength: 5 }
	},

	required: [ 'refresh_token' ],
	additionalProperties: false
};
