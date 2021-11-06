exports.createSubCategorySchema = {
	type: 'object',
	properties: {
		category_id: { type: 'number' },
		name: { type: 'string', minLength: 5 }
	},

	required: [ 'category_id', 'name' ],
	additionalProperties: false
};

exports.updateSubCategorySchema = {
	type: 'object',
	properties: {
		sub_category_id: { type: 'number' },
		name: { type: 'string', minLength: 5 },
		category_id: { type: 'number' }
	},

	required: [ 'sub_category_id' ],
	additionalProperties: true
};
