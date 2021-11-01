const router = require('express').Router();
const controller = require('./subCategory.controller');
const mustAdmin = require('../../middleware/auth.middleware').admin;

router.get('/', controller.getByCategory);
router.post('/', controller.createSubCategoryPost);
router.delete('/:id', controller.deleteSubCategory);
router.put('/', controller.updateSubCategory);

module.exports = router;
