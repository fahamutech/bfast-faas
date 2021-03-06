const chai = require('chai');
const chai_http = require('chai-http');
const FaasProxy = require('../src/bfast.functions').BfastFunctions;
const mocha = require("mocha");
const {it, describe, before, after, afterEach} = mocha

let proxyServer;
let faasProxy;

chai.use(chai_http);
chai.should();

describe('Functions', function () {

    before(function (done) {
        faasProxy = new FaasProxy({
            appId: 'faas',
            projectId: 'demo',
            port: 34556,
            functionsConfig: {
                functionsDirPath: __dirname+'/../example-functions',
                bfastJsonPath: null
            }
        });
         faasProxy.start().then(value => {
            proxyServer = value;
           done();
        });
    });

    after(async function () {
        await faasProxy.stop();
    });

    it('should call a function', function (done) {
        chai.request(proxyServer)
            .get('/hello')
            .end((req, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('Hello');
                done();
            });
    });

    it('should return not found code 404 for unknown function', function (done) {
        chai.request(proxyServer)
            .get('/joshua')
            .end((req, res) => {
                // console.log(res.text);
                res.should.have.status(404);
                // res.body.should.be.a('string');
                // res.body.message.should.equal('Hello');
                done();
            });
    });

    // it('should not call a function without appId to be supplied and function does not exist', function (done) {
    //     chai.request(proxyServer)
    //         .get('/example-functions/hellg5867tguyo')
    //         .end((req, res) => {
    //             res.should.have.status(401);
    //             res.body.should.be.a('object');
    //             res.body.message.should.be.a('string');
    //             res.body.message.should.equal('Unauthorized request');
    //             done();
    //         });
    // });
    //
    // it('should return function contents when appId is applied', function (done) {
    //     // this.timeout(3 * 60000);
    //     chai.request(proxyServer)
    //         .get('/example-functions/hello')
    //         .set('bfast-application-id', 'faas')
    //         .end((req, res) => {
    //             console.log(res.body);
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.message.should.be.a('string');
    //             res.body.message.should.equal('Hello, World!');
    //             done();
    //         });
    // });
    //
    // it('should return function contents when appId supplier in query params', function (done) {
    //     chai.request(proxyServer)
    //         .get('/example-functions/hello')
    //         .query('appId=faas')
    //         .end((req, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.message.should.be.a('string');
    //             res.body.message.should.equal('Hello, World!');
    //             done();
    //         });
    // });
    //
    // it('should return not found if function not exist', function (done) {
    //     chai.request(proxyServer)
    //         .get('/example-functions/hello98078778ui')
    //         .set('bfast-application-id', 'faas')
    //         .end((req, res) => {
    //             res.should.have.status(404);
    //             res.body.should.be.a('object');
    //             // res.body.message.should.be.a('string');
    //             // res.body.should.({});
    //             done();
    //         });
    // });

    // describe('Functions From a Directory', function () {
    //
    // });

});
