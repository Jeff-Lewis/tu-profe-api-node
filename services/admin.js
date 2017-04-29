var uuidV4 = require('uuid/v4');
var Promise = require('promise');

var Admin = require('../models/admin');

var AdminServices = {};

AdminServices.createAdmin = admin => {
    return new Promise((resolve, reject) => {
        admin.id = uuidV4();
        admin.active = false;
        Admin.create(admin, (err, newAdmin) => {
            if (err) { reject(err); }
            else { resolve(newAdmin); }
        });
    });
};

/**
 * Get Admin By Id
 */
AdminServices.getAdminById = adminId => {
    return new Promise((resolve, reject) => {
        Admin.get({ id: adminId }, (err, admin) => {
            if (err || admin === undefined) { reject('Admin not found'); }
            else {
                admin.courses = admin.courses || [];
                resolve(admin);
            }
        });
    });
};

AdminServices.getAdminByEmail = email => {
    return new Promise((resolve, reject) => {
        Admin.scan('email').eq(email).exec((err, admins) => {
            if (err) reject(err);
            else if (admins.length <= 0) reject('Ningun administrador fue encontrado');
            else resolve(admins[0]);
        });
    });
};

AdminServices.updateAdmin = (adminId, adminUpdated) => {
    console.info(adminId, adminUpdated)
    return AdminServices.getAdminById(adminId)
        .then(admin => {
            return new Promise((resolve, reject) => {
                admin = new Admin(adminUpdated);
                admin.save(err => {
                    if (err) { console.log(err); reject(err) }
                    else { resolve(admin) }
                });
            });
        });
};

module.exports = AdminServices;