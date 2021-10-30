module.exports.get = (req, res) => {
	return res.status(200).json({
		message: 'You are in the Landing route, method: GET'
	});
};

module.exports.post = (req, res) => {
	return res.status(200).json({
		message: 'You are in the Landing route, method: POST'
	});
};

module.exports.delete = (req, res) => {
	return res.status(200).json({
		message: 'You are in the Landing route, method: DELETE'
	});
};

module.exports.put = (req, res) => {
	return res.status(200).json({
		message: 'You are in the Landing route, method: PUT'
	});
};
