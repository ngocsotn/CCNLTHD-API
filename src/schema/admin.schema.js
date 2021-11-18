const regex_pattern = require("../constants/regex_pattern.constant");

exports.updateUserSchema = {
  type: "object",
  properties: {
    user_id: { type: "number" },
    email: { type: "string", pattern: regex_pattern.emailPattern },
    name: { type: "string", minLength: 5 },
    address: { type: "string", minLength: 5 },
    birth: { type: "string", pattern: regex_pattern.datePattern },
  },

  required: ["user_id"],
  additionalProperties: true,
};

exports.blockOrResetPassword = {
  type: "object",
  properties: {
    user_id: { type: "number" },
  },

  required: ["user_id"],
  additionalProperties: false,
};
