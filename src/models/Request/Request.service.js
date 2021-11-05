const Request = require('./request.model');
const Op = require('sequelize').Op;
const moment = require('moment');
moment().utcOffset('+07:00');

module.exports.get = async (req, res) => {
	console.log(req.token);
};

// SELECT
module.exports.findByUserId = async (user_id, exclude_arr = []) => {
	return await Request.findOne({
		where: { user_id },
		attributes: { exclude: exclude_arr }
	});
};

module.exports.findAll = async (
	page = 1,
	limit = 1,
	order_by = 'create_at',
	order_type = 'ASC',
	status,
	exclude_arr
) => {
	page = page ? page : 1;
	limit = limit ? limit : 999999999;
	status = status ? status : { [Op.ne]: null };

	return await Request.findAndCountAll({
		where: { status },
		attributes: { exclude: exclude_arr },
		offset: (+page - 1) * +limit,
		limit: +limit,
		order: [ [ order_by, order_type ] ]
	});
};

// INSERT
module.exports.createNewRequest = async (user_id, message) => {
	//check trên controller, nếu tạo rồi và còn hạn, ko cho tạo nữa
	//nếu controller pass nghĩa là phải xóa cái hết hạn cũ
	const new_data = await Request.create({
		user_id,
		message,
		status: 'pending',
		expire_at: moment().add(7, 'days').format('YYYY-MM-DD')
	}).catch((err) => {
		console.log(err);
	});

	return new_data;
};

// UPDATE
module.exports.updateStatus = async (user_id, status = 'pending') => {
	await Request.update(
		{
			status
		},
		{ where: { user_id } }
	);
};

// DELETE
//hàm này sẽ gọi khi: User X request cũ đã hết hạn và đang chuẩn bị tạo thêm request
module.exports.deleteByUserId = async (user_id) => {
	await Request.destroy({
		where: { user_id }
	}).catch((err) => {
		console.log(err);
	});
};
