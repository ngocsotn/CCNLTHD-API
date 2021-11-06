const router = require('express').Router();
const controller = require('./admin.controller');
const { admin } = require('../../middleware/auth.middleware');
const schema = require('../../schema/admin.schema');
const validator = require('../../middleware/validate.middleware');

router.get('/', admin(), controller.getAllUser);
router.get('/:id', admin(), controller.getUserDetails);
router.put('/', admin(), validator(schema.updateUserSchema), controller.updateUser);

module.exports = router;
