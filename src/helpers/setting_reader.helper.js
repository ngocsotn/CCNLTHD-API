module.exports.readEnvArray = (envPath) => {
	if (!envPath) return [];
	const list = envPath.split(' ').join('').split(',');

	return list;
};
