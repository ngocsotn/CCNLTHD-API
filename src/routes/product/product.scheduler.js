const nodeCron = require("node-cron");
const moment = require("moment");
const product_service = require("../../models/Product/Product.service");
const auction_service = require("../../models/Auction/Auction.service");
const auction_history_service = require("../../models/AuctionHistory/AuctionHistory.service");
const trade_service = require("../../models/TradeHistory/TradeHistory.service");

const cron_setting = { scheduled: true, timezone: "Asia/Ho_Chi_Minh" };
let product_dict = {};
module.exports.product_dict = product_dict;

// các hàm chính
// khởi tạo lúc server chạy
module.exports.init = async () => {
  console.log("INIT PRODUCT SCHEDULER \n");
  const list = await product_service.getForScheduler();

  for (const item of list) {
    this.addNewProductToAliveArray(item);
  }
};

// seller thêm product mới
module.exports.addNewProductToAliveArray = async (product) => {
  const now = moment().utcOffset(60 * 7);
  if (
    product.expire_at &&
    now < moment(product.expire_at, "DD/MM/YYYY HH:mm:ss")
  ) {
    product_dict[product.product_id] = {};
    product_dict[product.product_id].expire_at = product.expire_at;
    product_dict[product.product_id].name = product.name;
    const job = this.createJob(product.product_id);
    if (job) {
      product_dict[product.product_id].job = job;
      job.start();
    }
  }
};

// admin gỡ product
module.exports.deleteProductFromAliveArray = async (product_id) => {
  if (product_dict[product_id]) {
    const old = product_dict[product_id].job;
    if (old) {
      old.stop();
      delete product_dict[product_id];
    }
  }
};

// cho các sản phẩm tự gia hạn
// khi sản phẩm còn 5 phút đổ lại, có lượt bid thì gọi hàm này để +10p job
module.exports.overWriteJob = async (product_id, expire_at) => {
  if (product_dict[product_id]) {
    const old = product_dict[product_id].job;
    if (old) {
      old.stop();
    }
    product_dict[product_id].expire_at = expire_at;
    const job = this.createJob(product_id);
    if (job) {
      product_dict[product_id].job = job;
      job.start();
    }
  }
};

// các hàm cron
module.exports.createJob = (product_id) => {
  if (product_dict[product_id]) {
    return nodeCron.schedule(
      toCronFormat(product_dict[product_id].expire_at),
      () => {
        mainJob(product_id);
      },
      cron_setting
    );
  }
  return null;
};

const mainJob = async (product_id) => {
  console.log(
    moment()
      .utcOffset(60 * 7)
      .format("DD/MM/YYYY HH:mm:ss")
  );
  // cập nhật sản phẩm thành off

  //gửi email cho seller

  //nếu có bidder thắng thì thêm data vào trade, auctionHistory + gửi email

  //hủy job và xóa khỏi dict

  delete product_dict[product_id];
  // product_dict[product_id].job.stop();
  // product_dict[product_id].job = null;
};

const toCronFormat = (input) => {
  return moment(input, "DD/MM/YYYY HH:mm:ss").format("ss mm HH DD MM") + " *";
};
