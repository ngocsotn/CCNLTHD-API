module.exports = require('knex')({
	client: process.env.DB_SQL_TYPE,
	connection: {
		host: process.env.DB_IP || '127.0.0.1',
		port: process.env.DB_PORT,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
	},
	pool: {
		min: +process.env.DB_MIN_CONNECT,
		max: +process.env.DB_MAX_CONNECT
	}
});
