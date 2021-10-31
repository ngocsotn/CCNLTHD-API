const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
moment().utcOffset('+07:00');

class AuctionHistory extends Model {}

AuctionHistory.init(
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
			defaultValue: 'lose'
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		last_bid_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: moment(new Date()),
			get: function() {
				return moment(this.getDataValue('last_bid_at')).format('DD/MM/YYYY hh:mm:ss');
			}
		}
	},
	{
		sequelize: db,
		modelName: 'AuctionHistory'
	}
);

module.exports = AuctionHistory;
