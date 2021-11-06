const router = require('express').Router();
const controller = require('./favorite.controller');
const { bidder } = require('../../middleware/auth.middleware');
const schema = require('../../schema/favorite.schema');
const validator = require('../../middleware/validate.middleware');

// must logged in
router.get('/', bidder(), controller.getSelfFavorite);
router.post('/', bidder(), validator(schema.createFavoriteSchema), controller.createFavorite);
router.delete('/:id', bidder(), controller.deleteFavorite);

module.exports = router;
