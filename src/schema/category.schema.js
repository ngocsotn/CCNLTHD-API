exports.createCategorySchema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 5 }
	},

	required: [ 'name' ],
	additionalProperties: false
};

exports.updateCategorySchema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 5 },
		category_id: { type: 'number' }
	},

	required: [ 'name',  'category_id'],
	additionalProperties: false
};
