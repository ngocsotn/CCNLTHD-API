exports.bidSchema = {
	type: 'object',
	properties: {
		product_id: { type: 'number' },
		price: { type: 'number', minimum: 2000 }
	},

	required: [ 'product_id', 'price' ],
	additionalProperties: false
};

exports.buySchema = {
	type: 'object',
	properties: {
		product_id: { type: 'number' }
	},

	required: [ 'product_id' ],
	additionalProperties: false
};

exports.blockSchema = {
	type: 'object',
	properties: {
		user_id: { type: 'number' },
		product_id: { type: 'number' }
	},

	required: [ 'user_id', 'product_id' ],
	additionalProperties: false
};
