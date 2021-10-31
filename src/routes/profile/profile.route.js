const router = require('express').Router();
const controller = require('./profile.controller');
const mustLoggedIn = require('../../middleware/auth.middleware').authJWT;
const schema = require('../../schema/profile.schema');
const validator = require('../../middleware/validate.middleware');

router.get('/', mustLoggedIn(), controller.profileGet);
router.put('/', mustLoggedIn(), validator(schema.updateProfileSchema), controller.profilePut);

module.exports = router;
