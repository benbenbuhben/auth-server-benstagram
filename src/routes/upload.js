'use strict';

import express from 'express';
import multer from 'multer';
import auth from '../auth/middleware.js';
//import pathExt from 'path';
import Photo from '../models/photos.js';

import s3 from '../lib/s3.js';

const upload = multer({
  dest: `${__dirname}/../tmp`,
});

const uploadRouter = express.Router();

uploadRouter.post('/upload', auth, upload.any(), (req, res, next) => {
  console.log('HEYYYYYYYYYYY');
  console.log('please be defined...', req.user);

  if (!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'img')
    return next('title or sample was not provided');

  let file = req.files[0];
  let key = `${file.filename}.${file.originalname}`;
  //let imageName = file.originalname;
  //let ext = pathExt.extname(imageName);

  console.log('body', req.body);
  console.log('files', req.files);
  console.log(key);

  return s3.upload(file.path, key)
    .then(url => {
      let output = {
        owner: req.user._id,
        photoUrl: url,
      };
      //res.send(output);
      let photo = new Photo(output);
      photo.save()
        .then(data => sendJSON(res, data))
        .catch(next);
    })
    .catch(next);

  // var params = {
  //   Bucket: `${process.env.AWS_BUCKET}`,
  //   Key: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  //   Body: stream,
  // };
  // return s3.upload(params, function (err, data) {
  //   console.log(err, data);
  // });

  //res.sendStatus(418);

});

let sendJSON = (res, data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

export default uploadRouter;