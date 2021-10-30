const router = require('express').Router();
const controller = require('./images.controller');
const multer = require('./multer');

router.post('/', multer.array('image'), controller.uploadImages);
router.delete('/:id', controller.deleteImage);
router.post('/delete-many', controller.deleteManyImages);

module.exports = router;
