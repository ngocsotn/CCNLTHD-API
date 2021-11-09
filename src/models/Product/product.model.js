const db = require('../../utils/db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');
// moment().utcOffset('+07:00');

class Product extends Model {}

Product.init(
	{
		product_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		seller_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		bidder_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null
		},
		sub_category_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'on'
		},
		auto_extend: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		detail: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ''
		},
		price: {
			//giá trả ra để hiện thị cho "giá hiện tại"
			type: DataTypes.BIGINT,
			allowNull: true
		},
		hidden_price: {
			// giá "hiện tại" thực tế, dùng để so sánh logic
			type: DataTypes.BIGINT,
			allowNull: true
		},
		start_price: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		step_price: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		buy_price: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: 0
		},
		join_count: {//số người tham gia đâu giá
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: 0
		},
		bid_count: {//số lượt bid
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: 0
		},
		delete: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		create_at: {
			type: DataTypes.DATE,
			defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
			allowNull: false,
			get: function() {
				return moment(this.getDataValue('create_at')).format('DD/MM/YYYY HH:mm:ss');
			}
		},
		expire_at: {
			type: DataTypes.DATE,
			defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
			allowNull: false,
			get: function() {
				return moment(this.getDataValue('expire_at')).format('DD/MM/YYYY HH:mm:ss');
			}
		}
	},
	{
		sequelize: db,
		modelName: 'Product'
	},
	{}
);

module.exports = Product;
