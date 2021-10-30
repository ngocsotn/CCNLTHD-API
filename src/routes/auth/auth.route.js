const router = require('express').Router();
const controller = require('./auth.controller');
const schema = require('../../schema/auth.schema');
const validator = require('../../middleware/validate.middleware');
const mustLoggedIn = require('../../middleware/auth.middleware').authJWT;

router.post('/register', validator(schema.registerSchema), controller.registerPost);
router.post('/login', validator(schema.loginSchema), controller.loginPost);
router.post('/refresh', controller.refreshTokenPost);
router.get('/get-id', mustLoggedIn(), controller.getUsernameGet);
router.get('/test', controller.test);

module.exports = router;
