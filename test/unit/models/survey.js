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
    
    it('Participant validation passess valid participant', function(done) {
        var survey = require(path.join(projectDir, './models/survey'));
        var validation,
            participant = {
                gender: "male",
                ageGroup: 3,
                education: "University (Tertiary)",
                indigenous: true,
                region: "Croydon",
                sessionNumber: 1
            }
        validation = survey.validateParticipant(participant);
        assert.equal(0, validation.length);
        done();
    });
    
    it('Participant validation flags invalid participant fields', function(done) {
        var survey = require(path.join(projectDir, './models/survey'));
        var validation,
            participant = {
                gender: "female",
                education: "University (Tertiary)",
                indigenous: true,
                sessionNumber: 1
            }
        validation = survey.validateParticipant(participant);
        assert.equal(2, validation.length);
        assert.equal("missing", validation[0].code);
        assert.equal("missing", validation[1].code);
        done();
    });
    
    it('Store a submission', function(done) {
        this.timeout(5000);
        var survey = require(path.join(projectDir, './models/survey'));
        var validation,
            questions = QUESTION_IDS.slice(0),
            surveyResponses = [],
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
            
        questions.forEach(
            (questionId) => surveyResponses.push(
                Math.floor(Math.random()*5)
            )
        );
        
        submission.survey = surveyResponses;
        survey
            .storeSubmission(submission)
            .then(function(result) {
                assert.isObject(result);
                assert.equal(result.submissionId, 1);
                done();
            })
            .catch(function(err) {
                console.error(err);
                done(err);
            });
    });
}