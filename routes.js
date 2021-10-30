const router = require('express').Router();
const errorsHandler = require('./src/middleware/errors.middleware');
const myCors = require('./src/middleware/cors.middleware');

router.use(myCors);

//api
router.use('/', require('./src/routes/landing/landing.route'));
router.use('/auth', require('./src/routes/auth/auth.route'));
router.use('/image', require('./src/routes/images/images.route'));

//errors
router.use(errorsHandler.internalError);
router.use(errorsHandler.nullRoute);
module.exports = router;
