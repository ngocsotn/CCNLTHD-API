const Favorite = require("./favorite.model");

// SELECT
module.exports.findFavoriteListByUserId = async (
  user_id,
  exclude_arr,
  page = null,
  limit = null
) => {
  if (page !== null && page < 1) {
    throw Error("Trang phải lớn hơn 0");
  }

  if (!limit) {
    return Favorite.findAll({
      where: { user_id },
      attributes: { exclude: exclude_arr || [] },
    });
  }

  return Favorite.findAll({
    where: { user_id },
    attributes: { exclude: exclude_arr || [] },
    offset: (page - 1) * limit,
    limit,
  });
};

// INSERT
module.exports.createNewFavorite = async (user_id, product_id) => {
  const new_data = await Favorite.create({
    user_id,
    product_id,
  }).catch((err) => {
    console.log(err);
    return null;
  });

  return new_data;
};

// DELETE
module.exports.deleteFavorite = async (user_id, product_id) => {
  await Favorite.destroy({
    where: { user_id, product_id },
  }).catch((err) => {
    console.log(err);
  });
};
