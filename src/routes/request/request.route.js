const router = require('express').Router();
const controller = require('./request.controller');
const schema = require('../../schema/request.schema');
const validator = require('../../middleware/validate.middleware');
const { bidder, admin } = require('../../middleware/auth.middleware');

//bidder
router.get('/', bidder(), controller.bidderGet);
router.post('/', bidder(), validator(schema.bidderCreateRequestSchema), controller.bidderPost);

//admin
router.get('/admin/', admin(), controller.adminGetAll);
router.get('/admin/:id', admin(), controller.adminGet);
router.put('/admin/', admin(), validator(schema.adminPutRequestSchema), controller.adminPut);

module.exports = router;
