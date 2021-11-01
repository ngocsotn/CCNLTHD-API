const router = require('express').Router();
const controller = require('./rate.controller');

router.get('/', controller.get);

module.exports = router;
