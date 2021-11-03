const router = require("express").Router();
const controller = require("./request.controller");

router.get("/", controller.get);

module.exports = router;
