const db = require('../utils/db');

const addFullTextToProduct = () => {
	setTimeout(() => {
		//nếu chưa tồn tại thì thêm index cho cột name
		//SELECT COUNT(*) FROM information_schema.statistics WHERE table_name='product' AND index_name='name'
		db.query('ALTER TABLE product ADD FULLTEXT name (name DESC)').catch((err) => {
			console.log('FULLTEXT IN PRODUCT ALREADY EXIST, NO NEED TO ADD!\n');
		});
	}, 6000);
};

module.exports.init = () => {
	addFullTextToProduct();

	setTimeout(() => {
		console.log('\nServer is READY to go !!!\n');
	}, 15000);
};
