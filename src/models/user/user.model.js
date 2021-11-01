const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
moment().utcOffset('+07:00');

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		birth: {
			type: DataTypes.DATEONLY,
			allowNull: true,
			defaultValue: null,
			get: function() {
				if (this.getDataValue('birth')) {
					return moment(this.getDataValue('birth')).format('DD/MM/YYYY');
				}
				return null;
			}
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'bidder'
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		point_like: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		point_dislike: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		refresh_token: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		}
	},
	{
		sequelize: db,
		modelName: 'User'
	}
);

module.exports = User;
