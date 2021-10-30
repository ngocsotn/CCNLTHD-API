const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
	//secure: true
});

exports.uploads = (file, folder) => {
	return new Promise((resolve) => {
		cloudinary.uploader.upload(
			file,
			(result) => {
				resolve({
					url: result.url,
					id: result.public_id.split('/')[1]
					// all: result
				});
			},
			{
				resource_type: 'auto',
				folder: folder
			}
		);
	});
};

exports.deletes = (id) => {
	cloudinary.uploader.destroy(id, (error, result) => {
		// console.log(result, error);
	});
};
