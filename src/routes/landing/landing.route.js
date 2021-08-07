const router = require('express').Router();
const controller = require('./landing.controller');

router.get('/', controller.get);
router.post('/', controller.post);
router.delete('/', controller.delete);
router.put('/', controller.put);

module.exports = router;
