exports.rateSchema = {
	type: 'object',
	properties: {
		user_id_2: { type: 'number' },
		product_id: { type: 'number' },
		comment: { type: 'string', minLength: 5 },
		point: { type: 'number' }
	},

	required: [ 'user_id_2', 'product_id', 'comment', 'point' ],
	additionalProperties: true
};
