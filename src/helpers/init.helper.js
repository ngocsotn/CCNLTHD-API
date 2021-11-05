const db = require('../utils/db');

const addFullTextToProduct = () => {
	setTimeout(() => {
		//nếu chưa tồn tại thì thêm index cho cột name
    //SELECT COUNT(*) FROM information_schema.statistics WHERE table_name='product' AND index_name='name'
		db.query('ALTER TABLE product ADD FULLTEXT name (name DESC)').catch((err) => {
			console.log('FULLTEXT ALREADY EXIST, DONT NEED TO CREATE!\n');
		});
	}, 2000);
};

module.exports.init = () => {
	addFullTextToProduct();

	setTimeout(() => {
		console.log('\nServer is READY to go !!!\n');
	}, 4000);
};
