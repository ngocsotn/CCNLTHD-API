const rate = require("./rate.model");
const moment = require("moment");

// moment().utcOffset('+07:00');

// SELECT
// xem ai đó được đánh giá (user_id_1 là người thực hiện rate, user_id_2 là người ĐƯỢC rate)
module.exports.findAllByUserId2 = async (
  user_id_2 = 0,
  page = 1,
  limit = 9999999,
  order_by = "create_at",
  order_type = "DESC",
  exclude_arr = []
) => {
  page = page ? page : 1;
  limit = limit ? limit : 999999999;
  order_type = order_type ? order_type : "DESC";
  order_by = order_by ? order_by : "create_At";

  return await rate.findAndCountAll({
    where: { user_id_2 },
    attributes: { exclude: exclude_arr },
    offset: (+page - 1) * +limit,
    limit: +limit,
    order: [[order_by, order_type]],
  });
};

//xem bản thân đánh giá ng khác
module.exports.findAllByUserId1 = async (
  user_id_1 = 0,
  page = 1,
  limit = 9999999,
  order_by = "create_at",
  order_type = "DESC",
  exclude_arr = []
) => {
  page = page ? page : 1;
  limit = limit ? limit : 999999999;
  order_type = order_type ? order_type : "DESC";
  order_by = order_by ? order_by : "create_At";

  return await rate.findAndCountAll({
    where: { user_id_1 },
    attributes: { exclude: exclude_arr },
    offset: (+page - 1) * +limit,
    limit: +limit,
    order: [[order_by, order_type]],
  });
};

module.exports.findAllByUserId1AndProductId = async (user_id_1, product_id) => {
  return await rate.findOne({
    where: {
      user_id_1,
      product_id,
    },
  });
};

// module.exports.findAll = async (page = 1, limit = 1, order_by = 'create_at', order_type = 'DESC', exclude_arr = []) => {
// 	page = page ? page : 1;
// 	limit = limit ? limit : 999999999;

// 	return await rate.findAndCountAll({
// 		attributes: { exclude: exclude_arr },
// 		offset: (+page - 1) * +limit,
// 		limit: +limit,
// 		order: [ [ order_by, order_type ] ]
// 	});
// };

// INSERT
module.exports.createNewRate = async (
  user_id_1,
  user_id_2,
  product_id,
  comment = "",
  point
) => {
  comment = comment ? comment : "";

  const new_data = await rate
    .create({
      user_id_1,
      user_id_2,
      product_id,
      comment,
      point,
      create_at: moment().format("YYYY-MM-DD"),
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return new_data;
};

// UPDATE

// DELETE
