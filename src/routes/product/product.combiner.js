// file này sẽ query product, trả ra cả ảnh, số bidder tham gia hiện tại, thông tin điểm của holder hiện tại và seller
const product_image_service = require('../../models/ProductImage/ProductImage.service');
const auction_service = require('../../models/Auction/Auction.service');
const user_service = require('../../models/user/user.service');
const product_service = require('../../models/Product/Product.service');
const { handleUserInfoInProduct } = require('../../helpers/etc.helper');

module.exports.addFieldForProduct = async (product) => {
	if (!product.dataValues) {
		return {};
	}

	// thêm số người đang tham gia hiện tại
	// product.dataValues.join_count = await auction_service.getCountUserByProductId(product.product_id);

	// thông tin người bán + điểm
	const seller = await user_service.findUserById(product.seller_id, [ 'password', 'refresh_token' ]);
	product.dataValues.seller = await handleUserInfoInProduct(seller, 'seller');

	// thông tin người mua + điểm
	if (product.bidder_id) {
		if (product.bidder_id > 0) {
			const bidder = await user_service.findUserById(product.bidder_id, [ 'password', 'refresh_token' ]);
			product.dataValues.bidder = handleUserInfoInProduct(bidder, 'bidder');
		}
	} else {
		product.dataValues.bidder = {};
	}

	// thêm hình ảnh
	product.dataValues.images = await product_image_service.getImageListByProductId(product.product_id);

	return product;
};

module.exports.addFieldForArrayProduct = async (product_array) => {
	const rs = [];

	for (const product of product_array) {
		rs.push(await this.addFieldForProduct(product));
	}

	return rs;
};

module.exports.getAllProductDetailsById = async (product_id) => {
	const rs = await product_service.getProductDetails(product_id, []);

	if (rs) {
		return await this.addFieldForProduct(rs);
	} else {
		return {};
	}
};

module.exports.getAllProductDetailsByIdArray = async (product_id_array) => {
	for (const item of product_id_array) {
		item.dataValues.product = await this.getAllProductDetailsById(item.product_id);
	}

	return product_id_array;
};
