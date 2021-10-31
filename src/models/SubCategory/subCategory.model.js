const db = require("../../utils/db");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class SubCategory extends Model {}

SubCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    father_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "SubCategory",
  }
);
module.exports = SubCategory;
