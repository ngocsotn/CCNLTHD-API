const router = require('express').Router();
const controller = require('./rate.controller');
const { seller, bidder } = require('../../middleware/auth.middleware');

// xem lịch sử đánh giá người khác
router.get('/:id', controller.getOtherUserId);

// xem lịch sử đánh giá cá nhân
router.get('/', bidder(), controller.getSelfRate);

//bidder tạo đánh giá
router.post('/', bidder(), controller.bidderCreateRate);

module.exports = router;
