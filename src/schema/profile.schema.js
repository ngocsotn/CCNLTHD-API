const regex_pattern = require('../constants/regex_pattern.constant');

exports.updateProfileSchema = {
	// vì update dc quyền truyền hết hoặc truyền gì xài đó nên sẽ ko require gì
	// 1 là không truyền field đó, 2 là truyền nhưng phải đúng định dạng bên dưới
	type: 'object',
	properties: {
		email: { type: 'string', pattern: regex_pattern.emailPattern },
		name: { type: 'string', minLength: 5 },
		address: { type: 'string', minLength: 5 },
		birth: { type: 'string', pattern: regex_pattern.datePattern },
		password: { type: 'string', minLength: 5 },
		new_password: { type: 'string', minLength: 5 }
	},

	required: [],
	additionalProperties: false
};
