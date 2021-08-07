module.exports.getTimeUTC = () => {
	return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

module.exports.getTimeByZone = () => {
	return new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('en-GB');
};
