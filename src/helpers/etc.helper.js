module.exports.getTotalPage = (count = 1, limit = 1) => {
	if (limit >= count) {
		return 1;
	}

	return (count % +limit === 0 ? parseInt(count / +limit) : parseInt(count / +limit) + 1) || 0;
};

module.exports.handlePagingResponse = (list_data, page, limit) => {
	const rs = {};
	rs.count = list_data.count || 0;
	rs.page = +page || 1;
	rs.total_page = this.getTotalPage(rs.count, limit);
	rs.data = list_data.rows || [];

	return rs;
};
