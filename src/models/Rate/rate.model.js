const db = require("../../utils/db");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;
const moment = require("moment");
moment().utcOffset("+07:00");

class Rate extends Model {}

Rate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id_1: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user_id_2: {
      type: DataTypes.INTEGER,

      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    create_at: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue("rate")).format("DD/MM/YYYY");
      },
    },
  },
  {
    sequelize: db,
    modelName: "Rate",
  }
);

module.exports = Rate;
