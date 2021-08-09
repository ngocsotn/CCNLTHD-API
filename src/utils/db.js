// library: pg for PostgreSQL and Amazon Redshift, mysql/mysql2 for MySQL or MariaDB, sqlite3 for SQLite3, tedious for MSSQL.

//can use for pg, mysql, maria db, mssql
const knexSetting = {
	client: process.env.DB_SQL_TYPE,
	connection: {
		host: process.env.DB_IP || '127.0.0.1',
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		port: +process.env.DB_PORT,
		database: process.env.DB_NAME
	},
	pool: {
		min: +process.env.DB_MIN_CONNECT,
		max: +process.env.DB_MAX_CONNECT
	}
};

if (process.env.DB_SQL_TYPE === 'mssql') {
	knexSetting.connection.encrypt = true;
}

module.exports = require('knex')(knexSetting);
