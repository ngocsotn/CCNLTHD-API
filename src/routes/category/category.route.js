const router = require('express').Router();
const controller = require('./category.controller');
const mustAdmin = require('../../middleware/auth.middleware').admin;

router.get('/', controller.getCategory);
router.post('/', mustAdmin(), controller.createCategoryPost);
router.put('/', mustAdmin(), controller.updateCategoryName);
router.delete('/:id', mustAdmin(), controller.deleteCategory);

module.exports = router;
