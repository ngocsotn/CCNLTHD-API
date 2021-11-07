const router = require('express').Router();
const controller = require('./tradeHistory.controller');
const schema = require('../../schema/trade.schema');
const validator = require('../../middleware/validate.middleware');
const { bidder, seller } = require('../../middleware/auth.middleware');

// bidder
router.get('/bidder', bidder(), controller.bidderGetTrade);

// seller only
router.get('/seller', seller(), controller.sellerGetTrade);
router.put('/seller', seller(), validator(schema.updateTradeStatusSchema), controller.sellerPutStatus);

module.exports = router;
