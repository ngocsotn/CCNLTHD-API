// 200
exports.status200 = {
	message: 'Ok'
};

exports.status204 = {
	message: 'Không tìm thấy nội dung'
};

// 300
exports.status304 = {
	message: 'Không có gì thay đổi'
};
// 400
exports.status400 = {
	message: 'Thông tin gửi kèm không hợp lệ'
};

exports.status400_price = {
	message: 'Giá tiền phải là số dương, ít nhất 1000'
};

exports.status400_buy_price = {
	message: 'Giá mua ngay phải lớn hơn giá khởi điếm ít nhất 1 step'
};

exports.status400_step_price = {
	message: 'Bước giá phải bé hơn giá khởi điểm'
};

exports.status400_login_fail = {
	message: 'Email hoặc mật khẩu không hợp lệ'
};

exports.status400_not_exist_email = {
	message: 'Email không tồn tại!'
};

exports.status400_short_password = {
	message: 'Mật khẩu bạn nhập quá ngắn, nhập ít nhất 5 ký tự'
};

exports.status400_conflict_email = {
	message: 'Email đã được sử dụng!'
};

exports.status400_exist_product = {
	message: 'Không thể xóa vì danh mục con này còn sản phẩm!'
};

exports.status400_exist_sub_category = {
	message: 'Không thể xóa vì danh mục này còn danh mục con!'
};

exports.status400_blocked_user = {
	message: 'Bạn không thể đấu giá vì đã bị chặn ở sản phẩm này!'
};

exports.status_400_step_price_bid = {
	message: 'Giá tiền bước nhảy không hợp lệ!'
};

exports.status_400_step_price_bid = {
	message: 'Rất tiếc, giá hiện tại cao hơn rồi!'
};

exports.status_400_bid_time_over = {
	message: 'Sản phẩm đã hết thời gian đấu giá!'
};

exports.status_400_point_is_low = {
	message: 'Số bị đánh giá tệ của bạn đã bằng hoặc hơn 20%, không thể đấu giá!'
};

exports.status_400_request_alive = {
	message: 'Yêu cầu xin lên seller chưa hết hạn để tạo thêm!'
};

exports.status401_IP = {
	message: 'IP không được phép truy cập'
};

exports.status401_access_token = {
	message: 'token không hợp lệ'
};

exports.status401_refresh_token = {
	message: 'refresh_token không hợp lệ'
};

exports.status401_wrong_password = {
	message: 'Mật khẩu hiện tại không chính xác!'
};

exports.status403 = {
	message: 'Không có quyền truy cập'
};

exports.status404 = {
	message: 'Không tìm thấy đích!'
};

// 500
exports.status500 = {
	message: 'Lỗi: server không thể xử lý yêu cầu này!'
};
