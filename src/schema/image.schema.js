module.exports.createManyImages = {
	type: 'object',
	properties: {
		product_id: { type: 'string', minLength: 1 }
	},

	required: [ 'product_id' ],
	additionalProperties: true
};

module.exports.deleteMany = {
	type: 'object',
	properties: {
		cloud_id_array: { type: 'array' }
	},

	required: [ 'cloud_id_array' ],
	additionalProperties: false
};
