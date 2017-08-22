var should = require('should'),
    sinon = require('sinon');

describe('Course Controller Test:', () => {
    describe('Post:', () => {
        it('should not allow an empty name on book', () => {
            var Course = course => { this.save = () => { } };
            var req = {
                body: {
                    classification: "Regular",
                    area: "colegio",
                    courseName: "Acompañamiento"
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            var CourseServices = require('../services/course');

            res.status.calledWith(400).should().equal(true, 'Bad' + res.status.args[0][0]);
            res.send.calledWith('coursename is required').should.equal(true);
        });
    });
});