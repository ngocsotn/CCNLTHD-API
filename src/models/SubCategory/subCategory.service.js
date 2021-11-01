const subCategory = require("./subCategory.model");

// SELECT
module.exports.getAllByCategoryId = async (
  category_id,
  exclude_arr,
  page = null,
  limit = null
) => {
  if (page !== null && page < 1) {
    throw Error("Trang phải lớn hơn 0");
  }

  if (!limit) {
    return subCategory.findAll({
      where: { category_id },
      attributes: { exclude: exclude_arr || [] },
    });
  }
  return subCategory.findAll({
    where: { category_id },
    attributes: { exclude: exclude_arr || [] },
    offset: (page - 1) * limit,
    limit,
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
