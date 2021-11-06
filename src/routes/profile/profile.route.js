const router = require('express').Router();
const controller = require('./profile.controller');
const { bidder } = require('../../middleware/auth.middleware');
const schema = require('../../schema/profile.schema');
const validator = require('../../middleware/validate.middleware');

// logged user only
router.get('/', bidder(), controller.profileGet);
router.put('/', bidder(), validator(schema.updateProfileSchema), controller.profilePut);

module.exports = router;
