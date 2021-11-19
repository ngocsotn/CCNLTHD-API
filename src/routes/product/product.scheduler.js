const nodeCron = require("node-cron");
const moment = require("moment");
const mailer_helper = require("../../helpers/mailer.helper");
const user_service = require("../../models/user/user.service");
const product_service = require("../../models/Product/Product.service");
const auction_service = require("../../models/Auction/Auction.service");
const auction_history_service = require("../../models/AuctionHistory/AuctionHistory.service");
const trade_service = require("../../models/TradeHistory/TradeHistory.service");

const cron_setting = { scheduled: true, timezone: "Asia/Ho_Chi_Minh" };
const toCronFormat = (input) => {
  return moment(input, "DD/MM/YYYY HH:mm:ss").format("ss mm HH DD MM") + " *";
};
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
  const now = moment().utcOffset(0).add(7, "hours");
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

// admin gỡ product hoặc ai đó mua ngay, dừng chạy schedule
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
module.exports.overWriteJob = async (
  product_id,
  expire_at = "12/12/2012 18:18:18"
) => {
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
// tạo job cho item
module.exports.createJob = (product_id) => {
  if (product_dict[product_id]) {
    return nodeCron.schedule(
      toCronFormat(product_dict[product_id].expire_at),
      async () => {
        await mainJob(product_id);
      },
      cron_setting
    );
  }
  return null;
};

const mainJob = async (product_id) => {
  await this.whenProductEnd(product_id);

  //hủy job và xóa khỏi dict
  delete product_dict[product_id];
  // product_dict[product_id].job.stop();
  // product_dict[product_id].job = null;
};

// task sẽ được chạy tự động khi 1 sản phẩm expire
module.exports.whenProductEnd = async (product_id) => {
  console.log(`\nproduct_id ${product_id} ending now`);
  console.log(
    moment()
      .utcOffset(60 * 7)
      .format("DD/MM/YYYY HH:mm:ss")
  );
  console.log();

  // cập nhật sản phẩm thành off
  await product_service.updateProductStatus(product_id, "off");
  const product = await product_service.getProductDetails(product_id, []);
  const seller = await user_service.findUserById(product.seller_id);

  // gửi email cho seller
  await this.sendEmailSellerWhenEnd(product, seller);

  // Nếu có bidder thắng thì...
  if (product.bidder_id && product.hidden_price > product.start_price) {
    const bidder = await user_service.findUserById(product.bidder_id);

    // Thêm data vào AuctionHistory
    await this.addToAuctionHistory(product);

    // Thêm data vào TradeHistory
    await trade_service.createNewTrade(
      product.bidder_id,
      product.seller_id,
      product_id,
      "pending"
    );

    // Gửi mail cho người thằng
    await this.sendEmailBidderWhenEnd(product, bidder);
  }
};

module.exports.addToAuctionHistory = async (product) => {
  const list = await auction_service.getAllDistinctByproductId(
    product.product_id,
    "bid_at",
    "DESC"
  );

  for (const item of list) {
    if (product.bidder_id && item.user_id === product.bidder_id) {
      await auction_history_service.createNewHistory(
        item.user_id,
        product.product_id,
        "win",
        item.price,
        item.bid_at
      );
    } else {
      if (item.status === "accepted") {
        await auction_history_service.createNewHistory(
          item.user_id,
          product.product_id,
          "lose",
          item.price,
          item.bid_at
        );
      } else {
        await auction_history_service.createNewHistory(
          item.user_id,
          product.product_id,
          "denied",
          item.price,
          item.bid_at
        );
      }
    }
  }
};

// các hàm send email liên quan sản phẩm, đấu giá
// khi sản phẩm kết thúc, có winner thì send
module.exports.sendEmailBidderWhenEnd = async (product, bidder) => {
  const html = await mailer_helper.replaceHTML(
    "Chiến thắng đấu giá",
    `Chào ${bidder.name}, xin chúc mừng bạn đã chiến thắng đấu giá một sản phẩm trên sàn đấu giá EzBid.`,
    `Tên sản phẩm: ${product.name}<br>Giá kết thúc: ${product.hidden_price}`,
    "XEM NGAY",
    `${process.env.CLIENT_URL}/detail/${product.product_id}`
  );

  await mailer_helper.send(
    "Chiến thắng đấu giá",
    bidder.email,
    bidder.name,
    html
  );
};

// khi sản phẩm kết thúc, luôn gửi seller
module.exports.sendEmailSellerWhenEnd = async (product, seller) => {
  const html = await mailer_helper.replaceHTML(
    "Sản phẩm đã kết thúc",
    `Chào ${seller.name}, một sản phẩm của bạn trên sàn đấu giá EzBid đã kết thúc.`,
    `Tên sản phẩm: ${product.name}<br>Giá kết thúc: ${product.hidden_price}`,
    "XEM NGAY",
    `${process.env.CLIENT_URL}/detail/${product.product_id}`
  );

  await mailer_helper.send(
    "Sản phẩm đã kết thúc",
    seller.email,
    seller.name,
    html
  );
};

// khi 1 sản phẩm có ai bid cao hơn, gửi cho người giữ giá cũ nếu có
module.exports.sendEmailPreviousBidderWhenBid = async (product, bidder) => {
  const html = await mailer_helper.replaceHTML(
    "Mất vị trí giữ giá",
    `Chào ${bidder.name}, một sản phẩm bạn tham gia trên EzBid đã có người đặt giá cao hơn bạn.`,
    `Tên sản phẩm: ${product.name}<br>Giá lúc này: ${product.hidden_price}`,
    "XEM NGAY",
    `${process.env.CLIENT_URL}/detail/${product.product_id}`
  );

  await mailer_helper.send(
    "Mất vị trí giữ giá",
    bidder.email,
    bidder.name,
    html
  );
};

// khi ai đó bid thành công sản phẩm, gửi bidder mới
module.exports.sendEmailNewBidderWhenBid = async (product, bidder) => {
  const html = await mailer_helper.replaceHTML(
    "Đặt giá thành công",
    `Chào ${bidder.name}, bạn vừa đặt giá thành công một sản phẩm trên EzBid và trở thành người đặt giá cao nhất hiện tại.`,
    `Tên sản phẩm: ${product.name}<br>Giá lúc này: ${product.hidden_price}`,
    "XEM NGAY",
    `${process.env.CLIENT_URL}/detail/${product.product_id}`
  );

  await mailer_helper.send(
    "Đặt giá thành công",
    bidder.email,
    bidder.name,
    html
  );
};

// khi ai đó bid thành công sản phẩm, gửi seller
module.exports.sendEmailSellerWhenBid = async (product, seller) => {
  const html = await mailer_helper.replaceHTML(
    "Sản phẩm đang tăng giá",
    `Chào ${seller.name}, một sản phẩm bạn đăng bán trên EzBid đã có người đặt giá cao hơn.`,
    `Tên sản phẩm: ${product.name}<br>Giá lúc này: ${product.hidden_price}`,
    "XEM NGAY",
    `${process.env.CLIENT_URL}/detail/${product.product_id}`
  );

  await mailer_helper.send(
    "Sản phẩm đang tăng giá",
    seller.email,
    seller.name,
    html
  );
};

// khi seller block 1 bidder, gửi mail người đó
module.exports.sendEmailBidderWhenBlocked = async (product, bidder) => {
  const html = await mailer_helper.replaceHTML(
    "Bị từ chối ra giá",
    `Chào ${bidder.name}, rất tiếc bạn đã bị nhà bán hàng từ chối ra giá, hiện bạn sẽ không thể ra giá sản phẩm bên dưới nữa, nhưng bạn vẫn có thể tham gia đấu giá các sản phẩm khác.`,
    `Tên sản phẩm: ${product.name}`,
    "XEM NGAY",
    `${process.env.CLIENT_URL}/detail/${product.product_id}`
  );

  await mailer_helper.send(
    "Bị từ chối ra giá",
    bidder.email,
    bidder.name,
    html
  );
};
