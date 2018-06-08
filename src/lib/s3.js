'use strict';

const fse = require('fs-extra');
const aws = require('aws-sdk');
const s3 = new aws.S3();

// resolve a url

const upload = (path, key) => {
  console.log(path);
  let extArray = key.split('.');
  let ext = extArray[extArray.length-1];
  console.log('ext is ', ext);
  //Do some if shit to check if image file

  //incorporate content-type
  let config = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fse.createReadStream(path),
    ContentType: `image/${ext}`,
  };

  return s3.upload(config)
    .promise()
    .then(res => { // onSuccess
      console.log("AWS URL", res.Location);
      return fse.remove(path) // delete local file
        .then(() => res.Location); // resolve s3 url 
    })
    .catch(err => { // onFailure
      console.error("ERROR", err);
      return fse.remove(path) // delete local file
        .then(() => Promise.reject(err)); // continue rejecting error
    });
    
};

const remove = (key) => {
  return s3.deleteObject({
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  })
    .promise();
}; 

export default {upload,remove};


