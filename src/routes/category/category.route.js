const router = require('express').Router();
const controller = require('./category.controller');
const { admin } = require('../../middleware/auth.middleware');
const schema = require('../../schema/category.schema');
const validator = require('../../middleware/validate.middleware');

// public
// all trả ra nested, toàn bộ category chứa subCategory
router.get('/all', controller.getNestedCategory);
router.get('/', controller.getCategory);

// admin
router.post('/', admin(), validator(schema.createCategorySchema), controller.createCategoryPost);
router.put('/', admin(), validator(schema.updateCategorySchema), controller.updateCategoryName);
router.delete('/:id', admin(), controller.deleteCategory);

module.exports = router;
