exports.updateTradeStatusSchema = {
	type: 'object',
	properties: {
		bidder_id: { type: 'number' },
		product_id: { type: 'number' },
		status: { type: 'string', minLength: 4 },
		comment: { type: 'string', minLength: 0 }
	},

	required: [ 'bidder_id', 'product_id', 'status' ],
	additionalProperties: true
};
