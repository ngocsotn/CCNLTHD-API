const router = require("express").Router();
const controller = require("./tradeHistory.controller");
const { bidder, seller } = require('../../middleware/auth.middleware');

router.get("/", controller.get);

module.exports = router;
