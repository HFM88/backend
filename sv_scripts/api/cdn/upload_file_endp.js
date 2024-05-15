const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

let upload_file_endp = {};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname , 'cdnstorage')); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate a random 30-character string
    crypto.randomBytes(15, (err, buffer) => {
      if (err) {
        return cb(err);
      }
      const filename = buffer.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

const upload = multer({ storage: storage });

upload_file_endp.start = async function () {
  upload_file_endp.router = express.Router();
}

upload_file_endp.init = function (app, collection) {
  upload_file_endp.router.post('/upload', upload.single('file'), async function (req, res) {
    try {
      // File has been uploaded successfully
      const file = req.file;
      if (!file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }
      res.status(200).send({ msg: 'File uploaded successfully', filename: file.filename });
    } catch (error) {
      res.status(500).send({ error: 'Failed to upload file' });
    }
  });

  app.use("/cdn/upload", upload_file_endp.router);
}

module.exports = upload_file_endp;
