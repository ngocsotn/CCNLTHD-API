const http_message = require("../../constants/http_message.constant");
const product_image_service = require("../../models/ProductImage/ProductImage.service");
const cloudinary = require("./cloudinary");
const fs = require("fs");

const dir = process.env.IMG_TEMP_FOLDER;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

module.exports.uploadImages = async (req, res) => {
  const uploader = async (path) =>
    await cloudinary.uploads(path, process.env.CLOUDINARY_STORAGE_FOLDER);

  const { product_id } = req.body;
  const urls = [];
  const files = req.files;

  if (!files || files?.length < 1) {
    return res.status(400).json({ errs: ["Phải có ít nhất 1 ảnh"] });
  }
  if (!product_id) {
    // xóa ảnh tạm nếu ko có product_id
    for (const file of files) {
      const { path } = file;
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    return res.status(400).json({ errs: ["Phải có product_id"] });
  }

  //up ảnh lên cloud
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  //cập nhật url vào db
  for (const item of urls) {
    await product_image_service.createNewProductImage(
      +product_id,
      item.id,
      this.makeFullCloudId(item.id),
      item.url
    );
  }

  res.status(200).json({
    data: urls,
  });
};

module.exports.deleteImage = async (req, res) => {
  const cloud_id = this.makeFullCloudId(req.params.id);

  await cloudinary.deletes(cloud_id);
  await product_image_service.deleteProductImage(cloud_id);

  res.status(200).json(http_message.status200);
};

module.exports.deleteManyImages = async (req, res) => {
  const cloud_id_array = req.body.cloud_id_array;
  if (!cloud_id_array || cloud_id_array.length < 1) {
    return res
      .status(400)
      .json({ errs: ["Ít nhất phải có 1 cloud_id bên trong mảng"] });
  }

  for (const cloud_id of cloud_id_array) {
    await cloudinary.deletes(this.makeFullCloudId(cloud_id));
    await product_image_service.deleteProductImage(cloud_id);
  }

  res.status(200).json(http_message.status200);
};

module.exports.makeFullCloudId = (cloud_id) => {
  return process.env.CLOUDINARY_STORAGE_FOLDER + "/" + cloud_id;
};
