const db = require('../utils/db');

const addFullTextToProduct = () => {
	setTimeout(() => {
		db.query('ALTER TABLE product ADD FULLTEXT(name)');
	}, 8000);
};

module.exports.init = () => {
	addFullTextToProduct();

	setTimeout(() => {
		console.log('\nServer is READY to go !!!\n');
	}, 15000);
};
