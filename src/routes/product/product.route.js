const router = require('express').Router();
const controller = require('./product.controller');
const { seller, admin } = require('../../middleware/auth.middleware');

router.get('/', controller.ultimateSearchProduct);
router.post('/', seller(), controller.createProductPost);
router.put('/', seller(), controller.appendProductDetail);
router.delete('/:id', admin(), controller.deleteProduct);

module.exports = router;
