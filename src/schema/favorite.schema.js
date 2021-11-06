exports.createFavoriteSchema = {
	type: 'object',
	properties: {
		product_id: { type: 'number' }
	},

	required: [ 'product_id' ],
	additionalProperties: false
};
