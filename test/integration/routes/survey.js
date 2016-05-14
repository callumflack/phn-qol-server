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

const NUM_QUESTIONS = 26;

var responseBody;

module.exports = function() {
    describe('Survey endpoint', function() {
        it('HTTP1.1/GET `/survey`', (done) => {
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
        
        it('HTTP1.1/POST `/survey`', function(done) {
            var surveyResponses = [],
                submission = {
                    participant: {
                        gender: "female",
                        ageGroup: "25–34",
                        education: "University (Tertiary)",
                        indigenous: true,
                        region: "Croydon",
                        sessionNumber: 1
                    },
                    device: {
                        uuid: "custom-entered-manually-2",
                        provider: {
                            id: 2
                        }
                    }
                };
            
            for (var i = 0; i < NUM_QUESTIONS; i++)
                surveyResponses.push(Math.floor(Math.random()*5));

            submission.survey = surveyResponses;

            this.timeout(5000);
            request(app)
                .post('/survey')
                .set('Accept', 'application/json')
                .set('Content-type', 'application/json')
                .set('Device-token', process.env.DEVICE_TOKEN)
                .send(submission)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isNull(err);
                    done();
                });
        });        
    });
}