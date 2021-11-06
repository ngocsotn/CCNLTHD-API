const router = require('express').Router();
const controller = require('./auction.controller');
const { bidder, seller } = require('../../middleware/auth.middleware');
const schema = require('../../schema/auction.schema');
const validator = require('../../middleware/validate.middleware');

// bidder
// đấu giá
router.post('/', bidder(), validator(schema.bidSchema), controller.postBidProduct);
// mua ngay
router.post('/buy', bidder(), validator(schema.buySchema), controller.postBuyNow);

// seller
// seller block 1 user khác ko cho đấu giá
router.post('/block', seller(), validator(schema.blockSchema), controller.postBlockUser);

module.exports = router;
