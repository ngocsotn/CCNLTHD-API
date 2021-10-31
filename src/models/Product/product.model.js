const db = require("../../utils/db");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require("moment");
moment().utcOffset("+07:00");

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auto_extend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    step_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buy_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    delete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    expire_at: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue("expire_at")).format("DD/MM/YYYY");
      },
    },
  },
  {
    sequelize: db,
    modelName: "Product",
  }
);
module.exports = Product;
