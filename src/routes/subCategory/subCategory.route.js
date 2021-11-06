const router = require('express').Router();
const controller = require('./subCategory.controller');
const schema = require('../../schema/subCategory.schema');
const validator = require('../../middleware/validate.middleware');
const { admin } = require('../../middleware/auth.middleware');

// public
router.get('/', controller.getByCategory);

// admin
router.post('/', admin(), validator(schema.createSubCategorySchema), controller.createSubCategoryPost);
router.delete('/:id', admin(), controller.deleteSubCategory);
router.put('/', admin(), validator(schema.updateSubCategorySchema), controller.updateSubCategory);

module.exports = router;
