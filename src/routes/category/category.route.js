const router = require('express').Router();
const controller = require('./category.controller');
const admin = require('../../middleware/auth.middleware').admin;
const schema = require('../../schema/category.schema');
const validator = require('../../middleware/validate.middleware');

//all trả ra nested, toàn bộ category chứa subCategory
router.get('/all', controller.getNestedCategory);
router.get('/', controller.getCategory);
router.post('/', validator(schema.createCategorySchema), admin(), controller.createCategoryPost);
router.put('/', validator(schema.updateCategorySchema), admin(), controller.updateCategoryName);
router.delete('/:id', admin(), controller.deleteCategory);

module.exports = router;
