const router = require('express').Router();
const controller = require('./home.controller');

// 5 sản phẩm gần kết thúc
// 5 sản phẩm có giá cao nhất (giá public hiển thị)
// 5 sản phẩm có nhiề7 lượt bid nhất

router.get('/', controller.getSelfHistory);

module.exports = router;
