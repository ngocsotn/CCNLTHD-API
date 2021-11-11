const router = require("express").Router();
const controller = require("./auction.controller");
const { bidder, seller } = require("../../middleware/auth.middleware");
const schema = require("../../schema/auction.schema");
const validator = require("../../middleware/validate.middleware");

// public
// xem lịch sử đấu giá của 1 sản phẩm
router.get("/history/:id", controller.getBiddingHistory);

// bidder
// xem ds các sản phẩm đã và đang tham gia ít nhất 1 lần
router.get("/self", bidder(), controller.getSelfAreJoined);
// đấu giá
router.post(
  "/",
  bidder(),
  validator(schema.bidSchema),
  controller.postBidProduct
);

// mua ngay
router.post(
  "/buy",
  bidder(),
  validator(schema.buySchema),
  controller.postBuyNow
);

// seller
// seller block 1 user khác ko cho đấu giá
router.post(
  "/block",
  seller(),
  validator(schema.blockSchema),
  controller.postBlockUser
);

module.exports = router;
