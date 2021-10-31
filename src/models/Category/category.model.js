const db = require("../../utils/db");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Category",
  }
);
module.exports = Category;
