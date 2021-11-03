const { getTotalPage } = require("../../helpers/etc.helper");
const rate_service = require("../../models/Rate/rate.service");

module.exports.get = async (req, res) => {
  return res.json("ok");
};

module.exports.getByUserId = async (req, res) => {
  const { id, page, limit } = req.query;
  const rs = {};
  const list = await rate_service.getActiveRate(id, [], page, limit);
  rs.count = list.count;
  rs.data = list.rows;
  rs.page = +page;
  rs.total_page = getTotalPage(rs.count, limit);

  return res.json(rs);
};
