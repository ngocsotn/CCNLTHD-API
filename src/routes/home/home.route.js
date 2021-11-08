const router = require('express').Router();
const controller = require('./home.controller');
const { bidder } = require('../../middleware/auth.middleware');

router.get('/', bidder(), controller.getSelfHistory);

module.exports = router;
