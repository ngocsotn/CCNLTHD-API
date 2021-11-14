const subCategory = require("./subCategory.model");
const { Op } = require("sequelize");

// SELECT
module.exports.getDetailsBySubCategoryId = async (sub_category_id) => {
  return await subCategory.findOne({
    where: {
      sub_category_id,
    },
  });
};

module.exports.getAllByCategoryId = async (
  category_id,
  exclude_arr,
  page = 1,
  limit = 9999999
) => {
  page = page ? page : 1;
  limit = limit ? limit : 999999999;
  category_id = category_id ? category_id : { [Op.ne]: null };

  return await subCategory.findAndCountAll({
    where: { category_id: category_id },
    attributes: { exclude: exclude_arr || [] },
    offset: (+page - 1) * +limit,
    limit: +limit,
  });
};

// INSERT
module.exports.createNewSubCategory = async (category_id, name) => {
  const new_data = await subCategory
    .create({
      category_id,
      name,
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return new_data;
};

// UPDATE
module.exports.updateName = async (name, sub_category_id) => {
  await subCategory.update(
    {
      name,
    },
    {
      where: { sub_category_id },
    }
  );
};

module.exports.updateCategoryId = async (category_id, sub_category_id) => {
  await subCategory.update(
    {
      category_id,
    },
    {
      where: { sub_category_id },
    }
  );
};

// DELETE
module.exports.deleteSubCategory = async (sub_category_id) => {
  await subCategory
    .destroy({
      where: { sub_category_id },
    })
    .catch((err) => {
      console.log(err);
    });
};
