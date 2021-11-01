const router = require('express').Router();
const controller = require('./subCategory.controller');
const admin = require('../../middleware/auth.middleware').admin;

router.get('/', controller.getByCategory);
router.post('/', admin(), controller.createSubCategoryPost);
router.delete('/:id', admin(), controller.deleteSubCategory);
router.put('/', admin(), controller.updateSubCategory);

module.exports = router;
