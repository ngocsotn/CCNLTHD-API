const router = require('express').Router();
const controller = require('./auth.controller');
const schema = require('../../schema/auth.schema');
const validator = require('../../middleware/validate.middleware');
const mustLoggedIn = require('../../middleware/auth.middleware').authJWT;

router.post('/register', validator(schema.registerSchema), controller.registerPost);
router.post('/login', validator(schema.loginSchema), controller.loginPost);
router.post('/forgot', validator(schema.forgotSchema), controller.forgotPassword);
router.post('/recovery', validator(schema.recoverySchema), controller.recoveryPassword);
router.get('/verify', controller.verifyAccount);
router.post('/refresh', controller.refreshTokenPost);
router.get('/get-id', mustLoggedIn(), controller.getUsernameGet);

module.exports = router;
