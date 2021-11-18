const router = require("express").Router();
const controller = require("./admin.controller");
const { admin } = require("../../middleware/auth.middleware");
const schema = require("../../schema/admin.schema");
const validator = require("../../middleware/validate.middleware");

router.get("/", admin(), controller.getAllUser);
router.get("/:id", admin(), controller.getUserDetails);
router.put(
  "/",
  admin(),
  validator(schema.updateUserSchema),
  controller.updateUser
);

router.post(
  "/password",
  admin(),
  validator(schema.blockOrResetPassword),
  controller.resetPassword
);

router.post(
  "/block",
  admin(),
  validator(schema.blockOrResetPassword),
  controller.blockUser
);

router.post(
  "/unblock",
  admin(),
  validator(schema.blockOrResetPassword),
  controller.unblockUser
);

module.exports = router;
