var express = require('express'),
    multer = require('multer');

var AdvisoryServiceServices = require('../services/advisoryService');

var upload = multer({ dest: '..uploads/' });

var routes = AdvisoryService => {
    var advisoryServiceRouter = express.Router();

    advisoryServiceRouter.route('/')
        /**
         * POST - Create advisory Service.
         */
        .post((req, res) => {
            AdvisoryServiceServices.createAdvisoryService(req.body)
                .then(advisoryService => {
                    res.status(200).send(advisoryService);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    /**
     * POST - Calculate service price.
     */
    advisoryServiceRouter.route('/calculate')
        .post((req, res) => {
            var advisoryService = req.body;
            AdvisoryServiceServices.calculate(advisoryService)
                .then(advisoryService => {
                    res.status(200).send(advisoryService);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    /**
     * POST - Validate Service.
     */
    advisoryServiceRouter.route('/validate')
        .post((req, res) => {
            var advisoryService = req.body;
            AdvisoryServiceServices.validate(advisoryService)
                .then(advisoryService => {
                    res.status(200).send(advisoryService);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

    /**
     * GET - Retrieve service by student Id.
     */
    advisoryServiceRouter.route('/get-by-student/:studentId')
        .get((req, res) => {
            AdvisoryServiceServices.getAllByStudentId(req.params.studentId)
                .then(services => {
                    res.status(200).send(services);
                })
                .catch(err => res.status(500).send(err));
        });

    advisoryServiceRouter.post('/files/:advisoryServiceId', upload.single('file'), (req, res) => {
        var file = req.file;
        AdvisoryServiceServices.uploadFile(req.params.advisoryServiceId, file)
            .then(() => {
                res.status(200).send();
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });

    return advisoryServiceRouter;
};

module.exports = routes;