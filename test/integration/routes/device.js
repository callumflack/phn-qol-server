/**
 * Device reistration REST endpoint tests
 * 
 * Examines the `/device` REST endpoint to confirm that devices are issued with
 * valid JWT tokens.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import request from 'supertest';
import chai from 'chai';

const assert = chai.assert;
const projectPath = path.join(__dirname, '../../../');
const app = require(path.join(projectPath, './app.js'));

const TEST_PROVIDER_CODE = "ENT101";

var responseBody;

module.exports = function() {
    describe('Device endpoint', function() {
        it('HTTP1.1/GET `/device`', (done) => {
            this.timeout(5000);
            request(app)
                .get('/survey')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isNull(err);
                    assert.isObject(responseBody);
                    done();
                });
        });
        
        it('HTTP1.1/POST empty `/device` returns 400', (done) => {
            this.timeout(5000);
            request(app)
                .post('/device')
                .expect(400)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isNull(err);
                    done();
                });
        });
        
        it('HTTP1.1/DELETE `/device`', (done) => {
            this.timeout(5000);
            request(app)
                .delete('/device')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isNull(err);
                    assert.isObject(responseBody);
                    done();
                });
        });        
        
        it('Validation: valid providerCode', (done) => {
            this.timeout(5000);
            request(app)
                .post('/device')
                .send({
                    providerCode: TEST_PROVIDER_CODE,
                    ipAddress: '192.168.0.1',
                    userAgent: 'Mocha test framework.'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isObject(responseBody);
                    done();
                });
        });
        
        it('Validation: invalid providerCode raises not_found', (done) => {
            this.timeout(5000);
            request(app)
                .post('/device')
                .send({
                    providerCode: TEST_PROVIDER_CODE + 'laslda',
                    ipAddress: '192.168.0.1',
                    userAgent: 'Mocha test framework.'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isObject(responseBody);
                    assert.isArray(responseBody.errors);
                    assert.equal("providerCode", responseBody.errors[0].input);
                    assert.equal("not_found", responseBody.errors[0].code);
                    done();
                });
        });
    });
}