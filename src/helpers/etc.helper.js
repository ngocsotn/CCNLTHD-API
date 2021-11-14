module.exports.getTotalPage = (count = 1, limit = 1) => {
  if (limit >= count) {
    return 1;
  }

  return (
    (count % +limit === 0
      ? parseInt(count / +limit)
      : parseInt(count / +limit) + 1) || 0
  );
};

module.exports.handlePagingResponse = (list_data, page, limit) => {
  const local_limit = limit ? +limit : 9999999;
  const local_page = page ? +page : 1;

  const rs = {};
  rs.count = list_data.count ? list_data.count : 0;
  rs.page = local_page;

  rs.total_page = this.getTotalPage(+rs.count, +local_limit);
  rs.data = list_data.rows || [];

  return rs;
};

module.exports.handleUserInfoInProduct = (user, role) => {
  if (!user.dataValues) {
    return {};
  }

  const rs = {};
  rs.id = user.id;
  rs.name = "";
  if (role === "bidder") {
    rs.name = this.maskUsername(user.name);
  } else {
    rs.name = user.name;
  }
  rs.email = user.email;
  rs.point = +user.point_like - +user.point_dislike;
  rs.point_like = user.point_like;
  rs.point_dislike = user.point_dislike;

  return rs;
};

module.exports.maskUsername = (name) => {
  return "*****" + name.slice(parseInt(name.length / 2));
};
