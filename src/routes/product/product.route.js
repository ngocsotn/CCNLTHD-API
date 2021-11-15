const router = require("express").Router();
const controller = require("./product.controller");
const schema = require("../../schema/product.schema");
const validator = require("../../middleware/validate.middleware");
const { seller, admin } = require("../../middleware/auth.middleware");

// public
router.get("/", controller.ultimateSearchProduct);
router.get("/:id", controller.getProductDetails);

// seller
router.post(
  "/",
  seller(),
  validator(schema.createProductSchema),
  controller.createProductPost
);
router.put(
  "/",
  seller(),
  validator(schema.updateProductSchema),
  controller.appendProductDetail
);

// admin
router.delete("/:id", admin(), controller.deleteProduct);

module.exports = router;
