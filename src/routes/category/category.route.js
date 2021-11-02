const router = require('express').Router();
const controller = require('./category.controller');
const admin = require('../../middleware/auth.middleware').admin;
const schema = require('../../schema/category.schema');
const validator = require('../../middleware/validate.middleware');

router.get('/all', controller.getNestedCategory);
router.get('/', controller.getCategory);
router.post('/', validator(schema.createSchema), admin(), controller.createCategoryPost);
router.put('/', validator(schema.updateSchema), admin(), controller.updateCategoryName);
router.delete('/:id', admin(), controller.deleteCategory);

module.exports = router;
