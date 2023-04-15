const multer = require("multer");
const shrp = require("sharp");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, callback) {
    const uniqueImgSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueImgSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimeType.startsWith("image")) {
    callback(null, true);
  } else {
    callback(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/product-img/${file.filename}`);
    })
  );
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blog-img/${file.filename}`);
    })
  );
  next();
};

module.exports = { uploadImage, blogImgResize, productImgResize };
