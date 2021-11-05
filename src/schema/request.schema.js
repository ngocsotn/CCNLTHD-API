exports.bidderCreateRequestSchema = {
	type: 'object',
	properties: {
		message: { type: 'string', minLength: 1 }
	},

	required: [ 'message' ],
	additionalProperties: false
};

exports.adminPutRequestSchema = {
	type: 'object',
	properties: {
		status: { type: 'string', minLength: 5 },
		user_id: { type: 'number' }
	},

	required: [ 'status', 'user_id' ],
	additionalProperties: false
};
