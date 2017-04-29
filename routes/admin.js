var express = require('express'),
    multer = require('multer'),
    path = require('path');

var AdminService = require('../services/admin');

var upload = multer({ dest: '..uploads/' })

var routes = function (Admin) {
    var adminRouter = express.Router();

    adminRouter.route('/')
        .get(function (req, res) {
            Admin.scan().exec(function (err, admins) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(admins);
            });
        })
        .put((req, res) => {
            var admin = req.body;
            AdminService.updateAdmin(admin.id, admin)
                .then(admin => {
                    res.status(200).send(admin);
                }, err => {
                    res.status(500).send(err);
                });
        });

    adminRouter.route('/:adminId')
        .get(function (req, res) {
            AdminService.getAdminById(req.params.adminId)
                .then(admin => {
                    res.status(200).send(admin);
                },err => {
                    res.status(404).send(err);
                });
        });
    
    adminRouter.route('/email/:email')
        .get(function (req, res) {
            AdminService.getAdminByEmail(req.params.email)
                .then(admin => {
                    res.status(200).send(admin);
                },err => {
                    res.status(404).send(err);
                });
        });
    
    
    return adminRouter;
};

module.exports = routes;