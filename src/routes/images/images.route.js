const router = require('express').Router();
const schema = require('../../schema/image.schema');
const validator = require('../../middleware/validate.middleware');
const controller = require('./images.controller');
const multer = require('./multer');

router.post('/', multer.array('image'), validator(schema.createManyImages), controller.uploadImages);
router.delete('/:id', controller.deleteImage);
router.post('/delete-many', validator(schema.deleteMany), controller.deleteManyImages);

module.exports = router;
