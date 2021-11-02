const ajv_lib = require('ajv');
const ajv = new ajv_lib({ allErrors: true });
const http_message = require('../constants/http_message.constant');
const reader = require('../helpers/setting_reader.helper');

module.exports = (schema) => {
	return (req, res, next) => {
		const validate = ajv.compile(schema);
		console.log(req.body);
		const valid = validate(req.body);
		if (!valid) {
			// console.log(validate.errors);
			return res.status(400).json({
				message: http_message.status400.message,
				errs: reader.readAjvErrors(validate.errors)
			});
		}

		next();
	};
};
