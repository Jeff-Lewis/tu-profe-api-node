var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var extend = require('util');
var config = require('../config');
var NodeGeocoder = require('node-geocoder');

var School = require('../models/school');

var SchoolServices = {};
var geocoder = NodeGeocoder(config.geocoderOptions);

SchoolServices.createSchool = school => {
    var create = geoInfo => {        
        return new Promise((resolve, reject) => {
            school.id = uuidV4();
            school.city = geoInfo.city;
            school.country = geoInfo.country;
            school.countryCode = geoInfo.countryCode;
            school.zipcode = geoInfo.zipcode;
            school.formattedAddress = geoInfo.formattedAddress;
            school.latitude = geoInfo.latitude;
            school.longitude = geoInfo.longitude;
            School.create(school, function (err, newSchool) {
                if (err) {
                    reject(err);
                } else {
                    resolve(school);
                }
            });
        });
    }

    return geocoder.geocode(school.address)
        .then(geoInfo => create(geoInfo[0]))
        .catch(err => {
            throw err;
        });

};


module.exports = SchoolServices;