const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
moment().utcOffset('+07:00');

class Auction extends Model {}

Auction.init(
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
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'accepted'
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		bid_at: {
			type: DataTypes.DATE,
			allowNull: false,
			get: function() {
				return moment(this.getDataValue('bid_at')).format('DD/MM/YYYY HH:mm:ss');
			}
		}
	},
	{
		sequelize: db,
		modelName: 'Auction'
	}
);

module.exports = Auction;
