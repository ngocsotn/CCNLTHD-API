const regex_pattern = require("../constants/regex_pattern.constant");

exports.createProductSchema = {
  type: "object",
  properties: {
    sub_category_id: { type: "number" },
    name: { type: "string", minLength: 5 },
    start_price: { type: "number" },
    step_price: { type: "number" },
    buy_price: { type: "number" },
    expire_at: { type: "string", pattern: regex_pattern.dateTimePattern },
  },

  required: [
    "sub_category_id",
    "name",
    "start_price",
    "step_price",
    "buy_price",
    "expire_at",
  ],
  additionalProperties: true,
};

exports.updateProductSchema = {
  type: "object",
  properties: {
    product_id: { type: "number" },
  },

  required: ["product_id"],
  additionalProperties: true,
};
