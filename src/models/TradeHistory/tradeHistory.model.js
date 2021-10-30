const db = require("../../utils/db");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require("moment");
moment().utcOffset("+07:00");

class TradeHistory extends Model {}

TradeHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bidder_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    create_at: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue("create_at")).format("DD/MM/YYYY");
      },
    },
  },
  {
    sequelize: db,
    modelName: "TradeHistory",
  }
);

module.exports = TradeHistory;
