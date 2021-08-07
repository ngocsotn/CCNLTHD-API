module.exports.getIP = (req) => {
	return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress;
};
