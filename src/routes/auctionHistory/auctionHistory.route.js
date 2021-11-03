const router = require("express").Router();
const controller = require("./auctionHistory.controller");

router.get("/", controller.get);

module.exports = router;
