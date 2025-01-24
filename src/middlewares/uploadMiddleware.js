const multer = require('multer');
const path = require('path');

const uploadDir = path.resolve(__dirname, '../uploads');
const upload = multer({ dest: uploadDir });

const fotoMobileUpload = upload.fields([
    { name: 'fotoMobile', maxCount: 1 }
])

module.exports = {
    fotoMobileUpload
};