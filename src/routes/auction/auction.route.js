const router = require('express').Router();
const controller = require('./auction.controller');
const { bidder, seller } = require('../../middleware/auth.middleware');

// seller block 1 user khác ko cho đấu giá
router.post('/block', controller.postBlockUser);

// đấu giá
router.post('/', controller.postBidProduct);

// mua ngay
router.post('/buy', controller.postBuyNow);

module.exports = router;
