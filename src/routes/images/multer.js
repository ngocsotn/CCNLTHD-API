const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, process.env.IMG_TEMP_FOLDER);
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb({ message: 'Unsupported file format' }, false);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: Number(process.env.MAX_IMAGE_SIZE_MB) * 1024 * 1024 }, // tính theo MB
	fileFilter: fileFilter
});

module.exports = upload;
