const express = require('express');
const fs = require('fs');
const path = require('path');

const upload_file_endp = {};

upload_file_endp.start = async function () {
  upload_file_endp.router = express.Router();
}

upload_file_endp.init = function (app, collection) {
  upload_file_endp.router.post('/upload', async function (req, res) {
    try {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let token = '';
      for (let i = 0; i < 40; i++) {
          token += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      // Extract base64 data from request body
      const base64Data = req.body.imgdata.replace(/^data:image\/png;base64,/, "");
      // Define the file path
      const filePath = path.join('./media', token + ".png");
      // Write base64 data to file
      await fs.promises.writeFile(filePath, base64Data, 'base64');
      res.status(200).send({ message: 'File uploaded successfully' , filename : token });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send({ error: 'Failed to upload file' });
    }
  });

  app.use("/cdn", upload_file_endp.router);
}

module.exports = upload_file_endp;
