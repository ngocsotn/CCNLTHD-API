const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class ProductImage extends Model {}

ProductImage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		cloud_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		full_cloud_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'sub'
		},
		url: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize: db,
		modelName: 'ProductImage'
	}
);

module.exports = ProductImage;
