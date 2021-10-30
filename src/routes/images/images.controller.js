const cloudinary = require('./cloudinary');
const fs = require('fs');

var dir = process.env.IMG_TEMP_FOLDER;

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

module.exports.uploadImages = async (req, res) => {
	const uploader = async (path) => await cloudinary.uploads(path, process.env.CLOUDINARY_STORAGE_FOLDER);

	const urls = [];
	const files = req.files;

	for (const file of files) {
		const { path } = file;
		const newPath = await uploader(path);
		urls.push(newPath);
		fs.unlinkSync(path);
	}

	res.status(200).json({
		data: urls
	});
};

module.exports.deleteImage = async (req, res) => {
	const id = process.env.CLOUDINARY_STORAGE_FOLDER + '/' + req.params.id;

	await cloudinary.deletes(id);

	res.status(200).json({
		message: 'ok'
	});
};

module.exports.deleteManyImages = async (req, res) => {
	const id_array = req.body.id_array;

	for (const id of id_array) {
		await cloudinary.deletes(process.env.CLOUDINARY_STORAGE_FOLDER + '/' + id);
	}

	res.status(200).json({
		message: 'ok'
	});
};
