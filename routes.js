const { init } = require('./src/helpers/init.helper');
const router = require('express').Router();
const errorsHandler = require('./src/middleware/errors.middleware');
// const myCors = require('./src/middleware/cors.middleware');
const cors = require('cors');

// router.use(myCors);
router.use(cors());

//api
router.use('/', require('./src/routes/landing/landing.route'));
router.use('/auth', require('./src/routes/auth/auth.route'));
router.use('/image', require('./src/routes/images/images.route'));
router.use('/profile', require('./src/routes/profile/profile.route'));
router.use('/rate', require('./src/routes/rate/rate.route'));
router.use('/favorite', require('./src/routes/favorite/favorite.route'));
router.use('/sub-category', require('./src/routes/subCategory/subCategory.route'));
router.use('/category', require('./src/routes/category/category.route'));
router.use('/product', require('./src/routes/product/product.route'));

//errors
router.use(errorsHandler.internalError);
router.use(errorsHandler.nullRoute);

//init after create table
init();

module.exports = router;
