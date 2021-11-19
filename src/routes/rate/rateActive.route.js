const router = require("express").Router();
const controller = require("./rate.controller");
const { bidder } = require("../../middleware/auth.middleware");

// logged user only
// xem lịch sử bản thân đánh giá người khác
router.get("/", bidder(), controller.getSelfActiveRate);

module.exports = router;
