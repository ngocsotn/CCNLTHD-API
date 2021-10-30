const Sequelize = require("sequelize");
const fs = require("fs");
const path = "../../public/certificates/BaltimoreCyberTrustRoot.crt.pem";

const serverCa = [fs.readFileSync(require.resolve(path), "utf8")];

//Connection String
const db = new Sequelize({
  dialect: process.env.DB_SQL_TYPE,
  host: process.env.DB_IP,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
      ca: serverCa,
    },
  },
  timezone: process.env.DB_TIMEZONE,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  pool: {
    max: Number(process.env.DB_MAX_CONNECT),
    min: Number(process.env.DB_MIN_CONNECT),
    idle: 5 * 1000, //milliseconds
  },
});

module.exports = db;
