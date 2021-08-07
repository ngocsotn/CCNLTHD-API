const router = require('express').Router();
const controller = require('./auth.controller');
const schema = require('../../schema/schema.sample');
const validator = require('../../middleware/validate.middleware');
const authMiddleware = require('../../middleware/auth.middleware').authJWT;

router.post('/login', validator(schema.loginSchema), controller.loginPost);
router.post('/refresh', validator(schema.refreshTokenSchema), controller.refreshTokenPost);
router.get('/get-id', authMiddleware(), controller.getUsernameGet);

module.exports = router;
