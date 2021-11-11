const http_message = require("../../constants/http_message.constant");
const bcrypt_helper = require("../../helpers/bcrypt.helper");
const user_service = require("../../models/user/user.service");

// tự get thông tin cá nhân
module.exports.profileGet = async (req, res) => {
  const token = req.token;
  const rs = await user_service.findUserById(token.id, [
    "password",
    "code",
    "refresh_token",
  ]);

  return res.status(200).json(rs);
};

// thay đổi thông tin cá nhân, truyền gì thì thay đổi đó
module.exports.profilePut = async (req, res) => {
  const token = req.token;
  const { name, email, address, birth, password, new_password } = req.body;
  const err_message = [];

  if (name) {
    await user_service.updateName(token.id, name);
  }
  if (address) {
    await user_service.updateAddress(token.id, address);
  }
  if (birth) {
    await user_service.updateBirth(token.id, birth);
  }

  if (password && new_password) {
    if (new_password.length < 5) {
      err_message.push(http_message.status400_short_password.message);
    } else {
      const rs = await user_service.findUserById(token.id, []);
      if (!(await bcrypt_helper.verify(password, rs.password))) {
        err_message.push(http_message.status401_wrong_password.message);
      } else {
        await user_service.updatePassword(token.id, new_password);
      }
    }
  }

  if (email) {
    const rs = await user_service.updateEmail(token.id, email);
    if (!rs) {
      err_message.push(http_message.status401_conflict_email.message);
    }
  }

  const rs = await user_service.findUserById(token.id, ['password', 'refresh_token', 'code']);
  rs.dataValues.errs = err_message;

  return res.status(200).json(rs);
};
