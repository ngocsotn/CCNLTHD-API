const router = require('express').Router();
const controller = require('./category.controller');
const admin = require('../../middleware/auth.middleware').admin;

router.get('/', controller.getCategory);
router.post('/', admin(), controller.createCategoryPost);
router.put('/', admin(), controller.updateCategoryName);
router.delete('/:id', admin(), controller.deleteCategory);

module.exports = router;
