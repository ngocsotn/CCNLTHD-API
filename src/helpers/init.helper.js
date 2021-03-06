const db = require("../utils/db");
const product_scheduler = require("../routes/product/product.scheduler");

const addFullTextToProduct = () => {
  setTimeout(() => {
    //nếu chưa tồn tại thì thêm index cho cột name
    //SELECT COUNT(*) FROM information_schema.statistics WHERE table_name='product' AND index_name='name'
    db.query("ALTER TABLE product ADD FULLTEXT name (name DESC)").catch(
      (err) => {
        console.log("FULLTEXT IN PRODUCT ALREADY EXIST, NO NEED TO ADD!\n");
      }
    );
  }, 5000); // 5000
};

const initProductAliveList = () => {
  setTimeout(() => {
    product_scheduler.init();
  }, 8000); // 8000
};

module.exports.init = () => {
  addFullTextToProduct();
  initProductAliveList();
};
