const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
// moment().utcOffset('+07:00');

class TradeHistory extends Model {}

TradeHistory.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		bidder_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		seller_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'pending',
			allowNull: false
		},
		create_at: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			defaultValue: moment().format('YYYY-MM-DD'),
			get: function() {
				return moment(this.getDataValue('create_at')).format('DD/MM/YYYY');
			}
		}
	},
	{
		sequelize: db,
		modelName: 'TradeHistory'
	}
);

module.exports = TradeHistory;
