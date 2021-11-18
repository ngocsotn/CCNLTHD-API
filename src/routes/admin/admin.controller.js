const user_service = require("../../models/user/user.service");
const http_message = require("../../constants/http_message.constant");
const random_helper = require("../../helpers/random.helper");
const mailer_helper = require("../../helpers/mailer.helper");
const { handlePagingResponse } = require("../../helpers/etc.helper");

module.exports.getAllUser = async (req, res) => {
  const { limit, page } = req.query;
  const list = await user_service.getAllUser(
    ["password", "code", "refresh_token"],
    page,
    limit
  );
  const rs = handlePagingResponse(list, page, limit);

  return res.json(rs);
};

module.exports.getUserDetails = async (req, res) => {
  const user_id = req.params.id;
  const rs = await user_service.findUserById(user_id, [
    "password",
    "code",
    "refresh_token",
  ]);
  if (!rs) {
    return res.status(204).json({});
  }

  return res.json(rs);
};

module.exports.updateUser = async (req, res) => {
  const { birth, email, name, address, user_id } = req.body;
  const err_message = [];

  if (name) {
    await user_service.updateName(user_id, name);
  }
  if (address) {
    await user_service.updateAddress(user_id, address);
  }
  if (birth) {
    await user_service.updateBirth(user_id, birth);
  }
  if (email) {
    const rs = await user_service.updateEmail(user_id, email);
    if (!rs) {
      err_message.push(http_message.status401_conflict_email.message);
    }
  }

  const rs = await user_service.findUserById(user_id, [
    "password",
    "code",
    "refresh_token",
  ]);
  rs.dataValues.errs = err_message;

  return res.status(200).json(rs);
};

module.exports.resetPassword = async (req, res) => {
  const { user_id } = req.body;
  const new_password = random_helper.makeRandomString(20);
  const rs = await user_service.findUserById(user_id);

  if (!rs || rs.refresh_token === "block") {
    return res.status(400).json({ errs: ["Tài khoản người này đã bị khóa"] });
  }

  await user_service.updatePassword(user_id, new_password);
  console.log(`\n NEW PASSWORD OF USER_ID ${user_id}is: ${new_password}`);
  const html = await mailer_helper.replaceHTML(
    "Reset mật khẩu",
    `Chào ${rs.name}, Tài khoản trên EzBid của bạn vừa được reset mật khẩu bởi quản trị.`,
    `Mật khẩu mới là: ${new_password}`,
    "THỬ NGAY",
    `${process.env.CLIENT_URL}/login/`
  );

  await mailer_helper.send("Reset mật khẩu", rs.email, rs.name, html);

  return res.json(http_message.status200);
};

module.exports.blockUser = async (req, res) => {
  const token = req.token;
  const { user_id } = req.body;
  const rs = await user_service.findUserById(user_id);
  if (token.id === user_id || rs.role === "admin") {
    return res
      .status(400)
      .json({ errs: ["Không thể khóa tài khoản Quản trị viên"] });
  }

  if (!rs || rs.refresh_token === "block") {
    return res.status(400).json({ errs: ["Tài khoản người này đã bị khóa"] });
  }

  await user_service.updateRefreshToken(user_id, "block");
  const html = await mailer_helper.replaceHTML(
    "Bị khóa tài khoản",
    `Chào ${rs.name}, Tài khoản trên EzBid của bạn đã bị khóa bởi quản trị viên.`,
    ``,
    "",
    ""
  );

  await mailer_helper.send("Bị khóa tài khoản", rs.email, rs.name, html);

  return res.json(http_message.status200);
};
