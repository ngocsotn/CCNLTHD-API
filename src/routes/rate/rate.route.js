const router = require('express').Router();
const controller = require('./rate.controller');
const schema = require('../../schema/rate.schema');
const validator = require('../../middleware/validate.middleware');
const { bidder } = require('../../middleware/auth.middleware');

// public
// xem lịch sử được đánh giá của người khác
router.get('/:id', controller.getOtherUserId);

// logged user only
// xem lịch sử được đánh giá bản thân
router.get('/', bidder(), controller.getSelfRate);

// bidder
//bidder tạo đánh giá
router.post('/', validator(schema.rateSchema), bidder(), controller.bidderCreateRate);

module.exports = router;
