const Sequelize = require('sequelize');
//Connection String
const db = new Sequelize({
	dialect: process.env.DB_SQL_TYPE,
	host: process.env.DB_IP,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	// dialectOptions: {
	// 	useUTC: false // for reading from database
	// },
	timezone: process.env.DB_TIMEZONE,
	define: {
		freezeTableName: true,
		timestamps: false
	},
	pool: {
		max: Number(process.env.DB_MAX_CONNECT),
		min: Number(process.env.DB_MIN_CONNECT),
		idle: 5 * 1000 //milliseconds
	}
});

module.exports = db;
