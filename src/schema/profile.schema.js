const regex_pattern = require('../constants/regex_pattern.constant');

exports.updateProfileSchema = {
	type: 'object',
	properties: {
		email: { type: 'string', pattern: regex_pattern.emailPattern },
		name: { type: 'string', minLength: 5 },
		address: { type: 'string', minLength: 5 },
		birth: { type: 'string', pattern: regex_pattern.datePattern }
	},

	required: [ 'email', 'name', 'address', 'birth' ],
	additionalProperties: true
};
