const bcrypt = require('bcrypt');

module.exports.hash = async (data, times) => {
	return await bcrypt.hashSync(data, times);
};

module.exports.verify = async (data, data_hashed) => {
	return await bcrypt.compareSync(data, data_hashed);
};
