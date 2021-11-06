const router = require('express').Router();
const controller = require('./auction.controller');
const { bidder, seller } = require('../../middleware/auth.middleware');

// bidder
// đấu giá
router.post('/', bidder(), controller.postBidProduct);
// mua ngay
router.post('/buy', bidder(), controller.postBuyNow);

// seller
// seller block 1 user khác ko cho đấu giá
router.post('/block', seller(), controller.postBlockUser);

module.exports = router;
