module.exports.readEnvArray = (envPath) => {
	if (!envPath) return [];
	const list = envPath.split(' ').join('').split(',');

	return list;
};

module.exports.readAjvErrors = (arr) => {
	const rs = [];
	for (const item of arr) {
		rs.push(item.instancePath.split('/')[1] + ' ' + item.message);
	}

	return rs;
};
