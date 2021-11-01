const Product = require("./product.model");
const moment = require("moment");
moment().utcOffset("+07:00");

// SELECT
module.exports.getProductDetails = async (id, exclude_arr) => {
  return await Product.findOne({
    where: { id, delete: false },
    attributes: { exclude: exclude_arr || [] },
  });
};

module.exports.getManyProductBySubCategory = async (
  sub_category_id,
  exclude_arr,
  page = null,
  limit = null
) => {
  if (page !== null && page < 1) {
    throw Error("Trang phải lớn hơn 0");
  }

  if (!limit) {
    return Product.findAll({
      where: { sub_category_id, delete: false },
      attributes: { exclude: exclude_arr || [] },
    });
  }

  return Product.findAll({
    where: { sub_category_id, delete: false },
    attributes: { exclude: exclude_arr || [] },
    offset: (paeg - 1) * limit,
    limit,
  });
};

// INSERT
module.exports.createNewProduct = async (body, user_id) => {
  const {
    sub_category_id,
    name,
    auto_extend,
    detail,
    start_price,
    step_price,
    buy_price,
    expire_at,
  } = body;

  const new_data = await Product.create({
    user_id,
    sub_category_id,
    name,
    auto_extend,
    detail,
    start_price,
    step_price,
    buy_price,
    expire_at: moment(expire_at, "DD/MM/YYYY HH:mm:ss"),
  }).catch((err) => {
    console.log(err);
    return null;
  });

  return new_data;
};

// UPDATE (chỉ được append detail)
module.exports.updateAppendDetail = async (new_detail, id) => {
  const rs = await this.getProductDetails(id, []);
  const appended_detail =
    rs.detail +
    "\n✏️ " +
    moment().format("DD/MM/YYYY HH:mm:ss") +
    "\n" +
    new_detail;

  await Product.update(
    {
      detail: appended_detail,
    },
    {
      where: { id },
    }
  );
};

// DELETE (fake delete)
module.exports.deleteProductFake = async (id) => {
  await Product.update(
    {
      delete: true,
    },
    {
      where: { id },
    }
  );
};

// OTHERS
