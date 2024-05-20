const multer = require('multer');
const { tmpdir } = require('os');
const upload = multer({ dest: tmpdir() });

module.exports = upload.array('files');
