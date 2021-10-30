// 200
exports.status200 = {
  message: 'Ok'
}

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

exports.status400_login_fail = {
	message: 'Email hoặc mật khẩu không hợp lệ'
};

exports.status400_not_exist_email = {
  message: 'Email không tồn tại!'
}

exports.status401_IP = {
	message: 'IP không được phép truy cập'
};

exports.status401_access_token = {
	message: 'token không hợp lệ'
};

exports.status401_refresh_token = {
	message: 'refresh_token không hợp lệ'
};

exports.status401_conflict_email = {
	message: 'Email đã được sử dụng!'
};

exports.status403 = {
	message: 'Không có quyền truy cập'
};

exports.status404 = {
	message: 'Không tìm thấy đích!'
};

// 500
exports.status500 = {
	message: 'Server Error: Server can not handle that!'
};
