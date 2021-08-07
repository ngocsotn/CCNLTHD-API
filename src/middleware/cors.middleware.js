const cors = require('cors');
const readEnvArray = require('../helpers/setting_reader.helper').readEnvArray;

const whitelist = readEnvArray(process.env.CORS_WHITELIST);
const corsMethods = readEnvArray(process.env.CORS_METHODS) || [ 'GET' ];
const corsAccept = process.env.CORS_ACCEPT_SETTING;

const corsOption = {
	origin: (origin, callback) => {
		const isServerToServer = corsAccept === 'SERVER-SERVER' ? !origin : false;
		if (whitelist.indexOf(origin) !== -1 || isServerToServer) {
			callback(null, true);
		} else {
			callback(new Error('CORS'));
		}
	},
	methods: corsMethods
};

module.exports = cors(corsOption);
