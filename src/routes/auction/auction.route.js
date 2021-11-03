const router = require("express").Router();
const controller = require("./auction.controller");

router.get("/", controller.get);

module.exports = router;
