var aws = require('aws-sdk');
var Promise = require('promise');

var s3 = new aws.S3();
var S3 = {};

S3.uploadFile = function(bucketName, key, file){
    return new Promise((resolve, reject) => {
       var params = {
            Bucket: bucketName,
            Key: key
        };
        s3.putObject(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        }); 
    });
};

module.exports = S3;