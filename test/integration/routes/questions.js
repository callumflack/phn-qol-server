/**
 * Questions REST endpoint tests
 * 
 * This test suite examines the `/questions` REST endpoint, used for retireval
 * of survey questions.
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
    describe('Questions endpoint', function() {
        it('Response issued for `/questions`', (done) => {
            this.timeout(5000);
            request(app)
                .get('/questions')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    responseBody = res.body;
                    assert.isNull(err);
                    assert.isArray(responseBody);
                    done();
                });
        });

        it('Number of questions returned is 26', (done) => {
            assert.equal(responseBody.length, 26); 
            done(); 
        });
        
        it('Questions are well-formed', (done) => {
            responseBody.forEach((question) => {
                assert.isNumber(question.id);
                assert.isNumber(question.number);
                assert.isString(question.text);
                assert.isArray(question.answers);
            });
            done(); 
        });
        
        it('Questions have well-formed answers 0..4', (done) => {
            responseBody.forEach((question) => {
                var answerValues = [0, 0, 0, 0, 0];
                question.answers.forEach((answer) => {
                    assert.isString(answer.label);
                    assert.isTrue(answer.label.length > 0);
                    
                    assert.isNumber(answer.value);
                    assert.isTrue(answer.value >= 0);
                    assert.isTrue(answer.value <= 4);
                    
                    answerValues[answer.value] = true;
                });
                answerValues.forEach(set => assert.isTrue(set));
            });
            done(); 
        });
        
    });
}