const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
// moment().utcOffset('+07:00');

class Request extends Model {}

Request.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ''
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'pending',
			allowNull: false
		},
		create_at: {
			type: DataTypes.DATEONLY,
			defaultValue: moment().format('YYYY-MM-DD'),
			allowNull: false,
			get: function() {
				return moment(this.getDataValue('create_at')).format('DD/MM/YYYY');
			}
		},
		expire_at: {
			type: DataTypes.DATEONLY,
			defaultValue: moment().format('YYYY-MM-DD'),
			allowNull: false,
			get: function() {
				return moment(this.getDataValue('expire_at')).format('DD/MM/YYYY');
			}
		}
	},
	{
		sequelize: db,
		modelName: 'Request'
	}
);

module.exports = Request;
