const router = require('express').Router();
const controller = require('./recaptcha.controller');

router.post('/', controller.post);

module.exports = router;
