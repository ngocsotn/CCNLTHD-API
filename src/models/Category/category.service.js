const category = require("./category.model");

// SELECT
module.exports.getDetailByCategoryId = async (category_id) => {
  return await category.findOne({
    where: {
      category_id,
    },
  });
};

module.exports.getAll = async (exclude_arr = [], page = 1, limit = 9999999) => {
  page = page ? page : 1;
  limit = limit ? limit : 999999999;
  return await category.findAndCountAll({
    attributes: { exclude: exclude_arr },
    offset: (+page - 1) * +limit,
    limit: +limit,
  });
};

// INSERT
module.exports.createNewCategory = async (name) => {
  const new_data = await category
    .create({
      name,
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return new_data;
};

// UPDATE
module.exports.updateName = async (name, category_id) => {
  await category.update(
    {
      name,
    },
    {
      where: { category_id },
    }
  );
};

// DELETE
module.exports.deleteCategory = async (category_id) => {
  await category
    .destroy({
      where: { category_id },
    })
    .catch((err) => {
      console.log(err);
    });
};
