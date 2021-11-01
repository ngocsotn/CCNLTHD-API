const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
moment().utcOffset('+07:00');

class Rate extends Model {}

Rate.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		user_id_1: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		user_id_2: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		point: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: -1
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
		modelName: 'Rate'
	}
);

module.exports = Rate;
