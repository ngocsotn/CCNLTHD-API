exports.createSchema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 5 }
	},

	required: [ 'name' ],
	additionalProperties: false
};

exports.updateSchema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 5 },
		category_id: { type: 'number' }
	},

	required: [ 'name' ],
	additionalProperties: false
};
