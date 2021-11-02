const router = require('express').Router();
const controller = require('./admin.controller');
const admin = require('../../middleware/auth.middleware').admin;

router.get('/', admin(), controller.getAllUser);
router.get('/:id', admin(), controller.getUserDetails);
router.put('/', admin(), controller.updateUser);

module.exports = router;
