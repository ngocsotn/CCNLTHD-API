const router = require('express').Router();
const schema = require('../../schema/image.schema');
const validator = require('../../middleware/validate.middleware');
const { seller } = require('../../middleware/auth.middleware');
const controller = require('./images.controller');
const multer = require('./multer');

// seller
router.post('/', multer.array('image'), seller(), validator(schema.createManyImages), controller.uploadImages);
router.delete('/:id', seller(), controller.deleteImage);
router.post('/delete-many', seller(), validator(schema.deleteMany), controller.deleteManyImages);

module.exports = router;
