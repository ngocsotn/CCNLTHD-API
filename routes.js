const { init } = require('./src/helpers/init.helper');
const router = require('express').Router();
const errorsHandler = require('./src/middleware/errors.middleware');
// const myCors = require('./src/middleware/cors.middleware');
// const cors = require('cors');

// router.use(myCors);
// router.use(cors());

// api
router.use('/', require('./src/routes/landing/landing.route'));
router.use('/auth', require('./src/routes/auth/auth.route'));
router.use('/image', require('./src/routes/images/images.route'));
router.use('/profile', require('./src/routes/profile/profile.route'));
router.use('/rate', require('./src/routes/rate/rate.route'));
router.use('/favorite', require('./src/routes/favorite/favorite.route'));
router.use('/sub-category', require('./src/routes/subCategory/subCategory.route'));
router.use('/category', require('./src/routes/category/category.route'));
router.use('/product', require('./src/routes/product/product.route'));
router.use('/user', require('./src/routes/admin/admin.route'));
router.use('/request', require('./src/routes/request/request.route'));
router.use('/favorite', require('./src/routes/favorite/favorite.route'));
router.use('/rate', require('./src/routes/rate/rate.route'));
router.use('/rate-active', require('./src/routes/rate/rateActive.route'));
router.use('/history', require('./src/routes/auctionHistory/auctionHistory.route'));
router.use('/trade', require('./src/routes/tradeHistory/tradeHistory.route'));
router.use('/bid', require('./src/routes/auction/auction.route'));
router.use('/recaptcha', require('./src/routes/recaptcha/v2/recaptcha.route'));
router.use('/home', require('./src/routes/home/home.route'));

// errors
router.use(errorsHandler.internalError);
router.use(errorsHandler.nullRoute);

// init after create table
init();

module.exports = router;
