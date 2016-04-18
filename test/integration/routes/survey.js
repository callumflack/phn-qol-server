/**
 * Survey REST endpoint tests
 * 
 * Examines the `/survey` REST endpoint to confirm that it functions correctly.
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

var responseBody;

module.exports = function() {
    describe('Survey endpoint', function() {
        it('HTTP1.1/GET `/surey`', (done) => {
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
        
        it('HTTP1.1/POST `/surey`', (done) => {
            this.timeout(5000);
            request(app)
                .post('/survey')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isNull(err);
                    assert.isObject(responseBody);
                    done();
                });
        });        
    });
}