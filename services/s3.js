var aws = require('aws-sdk');
var Promise = require('promise');
var fs = require('fs');

var s3 = new aws.S3();
var S3 = {};

S3.uploadFile = function (bucketName, key, file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, function (err, data) {
            if (err) reject(err);
            else {
                var params = {
                    Bucket: bucketName,
                    Key: key,
                    Body: data,
                    ACL: 'public-read'
                };
                s3.upload(params, (err, response) => {
                    if (err) {                        
                        reject(err);
                    }
                    else {                        
                        resolve(response);
                    }
                });
            }
        });
    });
};

module.exports = S3;