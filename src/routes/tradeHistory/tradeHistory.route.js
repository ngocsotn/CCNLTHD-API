const router = require("express").Router();
const controller = require("./tradeHistory.controller");

router.get("/", controller.get);

module.exports = router;
