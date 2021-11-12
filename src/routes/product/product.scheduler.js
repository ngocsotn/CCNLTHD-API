const product_service = require("../../models/Product/Product.service");
const auction_service = require("../../models/Auction/Auction.service");
const auction_history_service = require("../../models/AuctionHistory/AuctionHistory.service");
const trade_service = require("../../models/TradeHistory/TradeHistory.service");

module.exports.product_alive_array = [];

module.exports.init = async () => {
  console.log("\nInit product alive list \n");
};

module.exports.addNewProductToAliveArray = async (product) =>{

};

module.exports.deleteProductFromAliveArray = async (product_id) => {

};