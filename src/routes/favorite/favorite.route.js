const router = require('express').Router();
const controller = require('./favorite.controller');

router.get('/', controller.get);

module.exports = router;