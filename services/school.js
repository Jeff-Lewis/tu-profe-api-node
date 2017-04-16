var uuidV4 = require('uuid/v4');
var Promise = require('promise');
var extend = require('util');
var NodeGeocoder = require('node-geocoder');

var School = require('../models/school');

var options = {
    provider: 'google',
    //apiKey: 'AIzaSyAQTbAu7Gw9icagUzEEcEidNt9REtWQ1EU', 
    formatter: 'json'
};

var geocoder = NodeGeocoder(options);

var SchoolServices = {};

SchoolServices.createSchool = school => {
    var create = geoInfo => {
        console.log(geoInfo);
        return new Promise((resolve, reject) => {
            school.id = uuidV4();
            school.city = geoInfo.city;
            school.country = geoInfo.country;
            school.countryCode = geoInfo.countryCode;
            school.zipcode = geoInfo.zipcode;
            school.formattedAddress = geoInfo.formattedAddress;
            school.latitude = geoInfo.latitude;
            school.longitude = geoInfo.longitude
            console.log(school);
            School.create(school, function (err, newSchool) {
                if (err) {
                    console.log(err);
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
            console.log(err);
            throw err;
        });

};


module.exports = SchoolServices;