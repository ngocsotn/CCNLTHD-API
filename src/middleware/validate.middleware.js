const ajv_lib = require('ajv');
const ajv = new ajv_lib({ allErrors: true });
const messageJson = require('../constants/http_message.helper');

module.exports = (schema) => {
	return (req, res, next) => {
		const validate = ajv.compile(schema);
		const valid = validate(req.body);
		if (!valid) {
			//console.log(validate.errors);
			return res.status(400).json(messageJson.status400);
		}

		next();
	};
};
