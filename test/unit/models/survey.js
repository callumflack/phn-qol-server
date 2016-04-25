/**
 * Syrvey model unit test
 * 
 * Unit tests for the survey model.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import chai from 'chai';

let projectDir = path.join(__dirname, '../../../');
let assert = chai.assert;

const QUESTION_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
                        23,24,25,26];

module.exports = function() {
    it('Survey validation for correct submission', function(done) {
        var survey = require(path.join(projectDir, './models/survey'));
        var validation;
        var questions = QUESTION_IDS.slice(0);
        var surveyResponses = [];
        
        questions.forEach(
            (questionId) => surveyResponses.push({
                questionId: questionId,
                response: Math.floor(Math.random()*5)
            })
        );

        validation =  survey.validateSurvey(surveyResponses);
        assert.equal(validation.length, 0);
        
        done();
    });
    
    it('Survey validation flags out-of-bounds responses', function(done) {
        var survey = require(path.join(projectDir, './models/survey'));
        var validation;
        var questions = QUESTION_IDS.slice(0);
        var surveyResponses = [];
        var dodgyResponses = [];

        // Question / responses setup
        questions.forEach(
            (questionId) => {
                var dodgyResponse = Math.floor(Math.random()*15) - 5; 
                 surveyResponses.push({
                    questionId: questionId,
                    response: dodgyResponse
                });
                if (dodgyResponse < 0 || dodgyResponse > 4)
                    dodgyResponses.push(questionId);
            }
        );

        // Unit test assertions
        validation =  survey.validateSurvey(surveyResponses);
        
        // One validation error for each dodgy response
        assert.equal(validation.length, dodgyResponses.length);
        
        // Check each validation error against the dodgy response
        validation.forEach(
            (validationError) => {
                dodgyResponses.splice(dodgyResponses.indexOf(validationError.questionId), 1);
                assert.equal(validationError.code, "out_of_bounds");
                
            }
        );
        
        // Check that all dodgy responsess have been dealt with
        assert.equal(dodgyResponses.length, 0);
        done();
    });
    
    it('Survey validation flags missing responses', function(done) {
        var survey = require(path.join(projectDir, './models/survey'));
        var validation;
        var questions = QUESTION_IDS.slice(0);
        var surveyResponses = [];
        var missingResponses = [];

        // Question / responses setup
        questions.forEach(
            (questionId) => {
                var submitResponse = Math.round(Math.random()); 
                
                if (submitResponse)
                    surveyResponses.push({
                        questionId: questionId,
                        response: submitResponse
                    });
                else
                    missingResponses.push(questionId);
            }
        );

        // Unit test assertions
        validation =  survey.validateSurvey(surveyResponses);
        
        // One validation error for each dodgy response
        assert.equal(validation.length, missingResponses.length);
        
        // Check each validation error against the dodgy response
        validation.forEach(
            (validationError) => {
                missingResponses.splice(missingResponses.indexOf(validationError.questionId), 1);
                assert.equal(validationError.code, "missing");
                
            }
        );
        
        // Check that all dodgy responsess have been dealt with
        assert.equal(missingResponses.length, 0);
        done();
    });
}