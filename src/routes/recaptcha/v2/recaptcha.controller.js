const request = require("request");

module.exports.post = async (req, res) => {
  const secret_key = process.env.CAPTCHA_V2_PRIVATE;
  const token = req.body.response;

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  // console.log(url);

  request(url, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ errs: ["Thông tin gửi không hợp lệ"] });
    }
    body = JSON.parse(body);
    // console.log();
    // console.log(body);

    if (body.success !== undefined && !body.success) {
      return res
        .status(400)
        .json({ message: "reCAPTCHA: thất bại", success: false });
    }
    res.json({ message: "reCAPTCHA: thành công", success: true });
  });
};
