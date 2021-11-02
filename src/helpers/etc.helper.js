module.exports.getTotalPage = (count = 1, limit = 1) => {
	if (limit >= count) {
		return 1;
	}

	return (count % +limit === 0 ? parseInt(count / +limit) : parseInt(count / +limit) + 1) || 0;
};
