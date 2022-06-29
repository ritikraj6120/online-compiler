const multer = require('multer');
const path = require('path');
// const path = require('path');
// const crypto = require('crypto');
// const {GridFsStorage} = require('multer-gridfs-storage');
// require('dotenv').config()
// const mongoURI = process.env.MONGO_URI;

// // Create storage engine
// const storage = new GridFsStorage({
// 	url: mongoURI,
// 	file: (req, file) => {
// 		return new Promise((resolve, reject) => {
// 			crypto.randomBytes(16, (err, buf) => {
// 				if (err) {
// 					return reject(err);
// 				}
// 				const filename = buf.toString('hex') + path.extname(file.originalname);
// 				const fileInfo = {
// 					filename: filename,
// 					bucketName: 'uploads'
// 				};
// 				resolve(fileInfo);
// 			});
// 		});
// 	}
// });

// const fileFilter = (req, file, cb) => {
// 	// console.log("Inside file filter ",file)
// 	const matches = ["image/png", "image/jpg", "image/gif", "image/jpeg", "video/mp4", "video/3gpp", "video/webm", "video/ogg","video/x-matroska"]
// 	if (matches.indexOf(file.mimetype) === -1)
// 		cb(new Error('Not a correct video or image file'), false);
// 	else {
// 		cb(null, true);
// 	}
// }
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// console.log(file)
	  cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
	  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	  cb(null,uniqueSuffix+path.extname(file.originalname))
	}
  })

module.exports = multer({ storage: storage }).fields([{ name: 'code', maxCount: 1 }, { name: 'input', maxCount: 1 }]);