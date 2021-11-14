const AuctionHistory = require("./auctionHistory.model");
const moment = require("moment");
const Op = require("sequelize").Op;

// SELECT
module.exports.findByUserId = async (
  user_id = 0,
  page = 1,
  limit = 9999999,
  status = null,
  order_type = "DESC",
  order_by = "last_bid_at",
  exclude_arr = []
) => {
  page = page ? page : 1;
  limit = limit ? limit : 9999999;
  status = status ? status : { [Op.ne]: null };
  order_type = order_type ? order_type : "DESC";
  order_by = order_by ? order_by : "last_bid_at";

  return await AuctionHistory.findAndCountAll({
    where: {
      status: status,
      user_id,
    },
    attributes: { exclude: exclude_arr },
    offset: (+page - 1) * +limit,
    limit: +limit,
    order: [[order_by, order_type]],
  });
};

// INSERT
//khi 1 sp kết thúc, hàm này được xài, mỗi user của sp X chỉ dc create 1 lần
module.exports.createNewHistory = async (
  user_id,
  product_id,
  status,
  price,
  last_bid_at = "12/12/2012 18:18:18"
) => {
  const new_data = await AuctionHistory.create({
    user_id,
    product_id,
    status,
    price,
    last_bid_at: moment(last_bid_at, "DD/MM/YYYY HH:mm:ss"),
  }).catch((err) => {
    console.log(err);
    return null;
  });

  return new_data;
};

// UPDATE

// DELETE
