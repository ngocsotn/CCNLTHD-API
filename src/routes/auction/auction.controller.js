const product_service = require("../../models/Product/Product.service");
const product_combiner = require("../product/product.combiner");
const auction_service = require("../../models/auction/auction.service");
const user_service = require("../../models/user/user.service");
const product_scheduler = require("../product/product.scheduler");
const {
  handlePagingResponse,
  maskUsername,
} = require("../../helpers/etc.helper");
const http_message = require("../../constants/http_message.constant");
const io = require("../../helpers/socket.helper");
const moment = require("moment");
// moment().utcOffset('+07:00');

//public
// xem lịch sử ra giá của 1 sản phẩm nào đó
module.exports.getBiddingHistory = async (req, res) => {
  const product_id = req.params.id;
  const { page, limit } = req.query;
  const product = await product_service.getProductDetails(product_id, []);

  const list = await auction_service.getAllByProductId(
    product_id,
    page,
    limit,
    "bid_at",
    "DESC",
    []
  );

  const rs = handlePagingResponse(list, +page, +limit);
  rs.bidder_id = product && product.bidder_id ? product.bidder_id : null;

  for (const item of rs.data) {
    if (item.user_id) {
      const bidder = await user_service.findUserById(item.user_id, [
        "password",
        "refresh_token",
      ]);
      item.dataValues.name = maskUsername(bidder.name);
      item.dataValues.like = bidder.point_like;
      item.dataValues.dislike = bidder.point_dislike;
    }
  }

  // const test = await auction_service.getSecondPlaceBidder(2, 1);
  // console.log(test);

  return res.json(rs);
};

//bidder
// xem danh sách sản phẩm bản thân đã, đang tham gia
module.exports.getSelfAreJoined = async (req, res) => {
  const token = req.token;
  const { page, limit } = req.query;

  const list = await auction_service.getAllDistinctByUserId(
    token.id,
    page,
    limit,
    "bid_at",
    "DESC",
    []
  );
  const rs = handlePagingResponse(list, page, limit);
  // thêm thông tin sản phẩm chi tiết vào cho từng item...
  await product_combiner.getAllProductDetailsByIdArray(rs.data);

  return res.json(rs);
};

//mua ngay
module.exports.postBuyNow = async (req, res) => {
  const token = req.token;
  const { product_id } = req.body;
  const product = await product_service.getProductDetails(product_id, []);
  const bidder = await user_service.findUserById(token.id);
  const old_bidder =
    (await user_service.findUserById(product.bidder_id)) || null;
  const price = product.buy_price || null;

  if (!price) {
    return res.status(400).json({ errs: ["Sẩn phẩm này không thể mua ngay"] });
  }

  const is_valid_bidder = await validationBid(bidder, product, price);
  if (is_valid_bidder) {
    return res.status(400).json(is_valid_bidder);
  }

  // đếm lại số ng tham gia bid
  const join_count = await auction_service.getCountUserByProductId(product_id);
  await product_service.updateJoinCount(product_id, +join_count);

  // tạo lịch sử tham gia bid
  // update số người tham gia sản phẩm, tổng số lượt bid
  // gửi mail holder trước nếu có
  await stepAfterValidate(token, price, product_id, product, old_bidder);

  // dừng chạy scheduler job dừng lúc expire, vì sẽ dừng ngay lúc này
  await product_scheduler.deleteProductFromAliveArray(product_id);

  //cập nhật lại expire = now
  const now = moment()
    .utcOffset(60 * 7)
    .subtract(1, "minutes");
  await product_service.updateExpireAt(
    product_id,
    now.format("DD/MM/YYYY HH:mm:ss")
  );

  // chạy các task khi sản phẩm kết thúc + gửi mail cho seller, holder
  await product_scheduler.whenProductEnd(product_id);

  //send socket khi mua ngay
  io.boardCast(product_id);

  return res.json(http_message.status200);
};

// bid sản phẩm
module.exports.postBidProduct = async (req, res) => {
  const token = req.token;
  const { price, product_id } = req.body;

  const product = await product_service.getProductDetails(product_id, []);
  const seller = await user_service.findUserById(product.seller_id, []);
  const bidder = await user_service.findUserById(token.id, []);
  const old_bidder =
    (await user_service.findUserById(product.bidder_id)) || null;

  const is_valid_bidder = await validationBid(bidder, product, price);
  if (is_valid_bidder) {
    return res.status(400).json(is_valid_bidder);
  }

  // nếu pass hết KIỂM TRA

  // tạo lịch sử tham gia bid
  // update số người tham gia sản phẩm, tổng số lượt bid
  // gửi mail holder trước nếu có
  await stepAfterValidate(token, price, product_id, product, old_bidder);

  // nếu có giá mua ngay
  // và nếu giá hiện tại >= giá mua ngay thì kết thúc đấu giá
  if (
    product.buy_price &&
    +price >= +product.buy_price &&
    +product.buy_price > 1000
  ) {
    // dừng chạy scheduler job dừng lúc expire, vì sẽ dừng ngay
    await product_scheduler.deleteProductFromAliveArray(product_id);

    //cập nhật lại expire = now
    const now = moment()
      .utcOffset(60 * 7)
      .subtract(1, "minutes");
    await product_service.updateExpireAt(
      product_id,
      now.format("DD/MM/YYYY HH:mm:ss")
    );

    // chạy các task khi sản phẩm kết thúc + gửi mail cho seller, holder
    await product_scheduler.whenProductEnd(product_id);
  } else {
    // Gia hạn sản phẩm nếu có thể
    // thời gian lúc bid - expire_at <= 5 phút thì gia hạn 10 phút
    if (product.auto_extend) {
      const now = moment().utcOffset(0).add(7, "hours");
      const end = moment(product.expire_at, "DD/MM/YYYY HH:mm:ss");
      const duration = moment.duration(end.diff(now));
      const minutes = duration.asMinutes();
      if (minutes <= 5 && minutes > 0.0) {
        const new_expire = end.add(10, "minutes").format("DD/MM/YYYY HH:mm:ss");

        //update lại expire trong DB của sản phẩm
        await product_service.updateExpireAt(product_id, new_expire);

        // dừng job đang chạy và tạo job mới dựa vào expire mới
        await product_scheduler.overWriteJob(product_id, new_expire);
      }
    }

    // send mail cho seller và bidder (holder mới)
    if (seller) {
      await product_scheduler.sendEmailSellerWhenBid(product, seller);
    }
    if (bidder) {
      await product_scheduler.sendEmailNewBidderWhenBid(product, bidder);
    }
  }

  //Gửi socket khi bid thành công
  io.boardCast(product_id);

  return res.json(http_message.status200);
};

const stepAfterValidate = async (
  token,
  price,
  product_id,
  product,
  old_bidder
) => {
  // tạo lịch sử tham gia
  await auction_service.createNewAuction(
    token.id,
    product_id,
    "accepted",
    price
  );

  // update tên holder và giá mới
  await product_service.updateHolderAndHiddenPrice(product_id, token.id, price);

  // update lại số người tham gia bid
  const join_count = await auction_service.getCountUserByProductId(product_id);
  await product_service.updateJoinCount(product_id, +join_count);

  // update tăng tổng số lượt bid của sản phẩm
  await product_service.updateIncreaseBidCount(product_id);

  product.bidder_id = token.id;
  product.hidden_price = +price;
  product.price = +price;

  // nếu có người giữ giá trước (holder cũ)
  // gửi email cho người giữ giá cũ biết
  if (old_bidder && old_bidder.id !== token.id) {
    await product_scheduler.sendEmailPreviousBidderWhenBid(product, old_bidder);
  }
};

const validationBid = async (bidder, product, price) => {
  // >= 0.8 là ok
  if (bidder.point_like + bidder.point_dislike > 0) {
    if (
      +bidder.point_like / (+bidder.point_dislike + +bidder.point_like) <
      0.8
    ) {
      return { errs: [http_message.status_400_point_is_low.message] };
    }
  }

  const is_blocked = await auction_service.getUserByIdAndStatus(
    bidder.id,
    product.product_id,
    "denied"
  );

  if (is_blocked) {
    return { errs: [http_message.status400_blocked_user.message] };
  }

  if (product.status !== "on") {
    return { errs: [http_message.status_400_bid_time_over.message] };
  }

  const now = moment().utcOffset("+07:00");
  if (now > moment(product.expire_at, "DD/MM/YYYY HH:mm:ss")) {
    return { errs: [http_message.status_400_bid_time_over.message] };
  }

  if (+price <= +product.hidden_price || +price <= +product.start_price) {
    return { errs: [http_message.status_400_less_price_bid.message] };
  }

  if (+price % +product.step_price !== 0) {
    return { errs: [http_message.status_400_step_price_bid.message] };
  }

  return null;
};

//seller
module.exports.postBlockUser = async (req, res) => {
  const { user_id, product_id } = req.body;
  const check = await auction_service.getUserByIdAndStatus(
    user_id,
    product_id,
    "denied"
  );
  if (check) {
    return res
      .status(400)
      .json({ errs: ["Bạn đã từ chối người này với sản phầm hiện tại rồi"] });
  }

  await auction_service.updateStatus(user_id, product_id, "denied");

  // lấy product kiểm tra xem holder id trùng không
  const product = await product_service.getProductDetails(product_id, []);
  const bidder = await user_service.findUserById(user_id, []);

  // thay thế nếu đó là holder cao nhất hiện tại trong product, thay user 2nd || null
  if (+product.bidder_id === +user_id) {
    const second_bidder = await auction_service.getSecondPlaceBidder(
      user_id,
      product_id
    );

    if (second_bidder) {
      await product_service.updateHolderAndHiddenPrice(
        product_id,
        second_bidder.user_id,
        second_bidder.price
      );
    } else {
      await product_service.updateHolderAndHiddenPrice(
        product_id,
        null,
        product.start_price
      );
    }
  }

  // gửi email cho bidder bị block
  await product_scheduler.sendEmailBidderWhenBlocked(product, bidder);

  // gửi socket khi seller block ai đó vì có thể update lại người holder top
  io.boardCast(product_id);

  return res.json(http_message.status200);
};
