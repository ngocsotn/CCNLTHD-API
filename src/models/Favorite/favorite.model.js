const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class Favorite extends Model {}

Favorite.init(
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
		}
	},
	{
		sequelize: db,
		modelName: 'Favorite'
	}
);

module.exports = Favorite;
