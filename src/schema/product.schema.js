const regex_pattern = require('../constants/regex_pattern.constant');

exports.createProductSchema = {
	type: 'object',
	properties: {
		sub_category_id: { type: 'number' },
		name: { type: 'string', minLength: 5 },
		auto_extend: { type: 'boolean' },
		detail: { type: 'string', minLength: 5 },
		start_price: { type: 'number', minimum: 1000 },
		step_price: { type: 'number', minimum: 1000 },
		buy_price: { type: 'number', minimum: 2000 },
		expire_at: { type: 'string', pattern: regex_pattern.dateTimePattern }
	},

	required: [
		'sub_category_id',
		'name',
		'auto_extend',
		'detail',
		'start_price',
		'step_price',
		'buy_price',
		'expire_at'
	],
	additionalProperties: true
};

exports.updateProductSchema = {
	type: 'object',
	properties: {
		product_id: { type: 'number' },
		detail: { type: 'string', minLength: 5 }
	},

	required: [ 'product_id', 'detail' ],
	additionalProperties: false
};
