/**
 * Survey route
 * 
 * This Express.js router is used to submit and retrieve survey submissions for
 * the PHN Quality of Life survey. Survey submissions may be POSTed to this end-
 * point or retrieved with the appropriate authentication.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

var express = require('express');
var router = express.Router();
var deviceModel = require('../models/device');
var surveyModel = require('../models/survey');

router
    .get(
        '/',
        /**
         * Retrieves all survey submissions, automatically paginating results to
         * prevent timeouts, etc.
         * This method requires authentication.
         */
        (req, res, next) => {
            res.json({ a: "Please authenticate." });
        }
    ).post(
        '/',
        /**
         * Processes a new submission to the survey, accepting a set of question
         * responses.
         */
        (req, res, next) => {
            var submission = {
                survey: req.body.survey,
                participant: req.body.participant
            },
            validation,
            auth = req.headers["device-token"],
            deviceInfo,
            errors = [];
            
            deviceModel
                .verifyToken(auth)
                .then(validateSubmission)
                .then(storeSubmission)
                .catch((err) => errors.push(err))
                
            /**
             * Validates the data submitted using the SurveyModel model, using
             * the Promise.reject method to catch any validation issues.
             * If the submitted data is correct (along with the device token
             * supplied from the previous method) then the method resolves an
             * object containing all three necessary parts for submission ({
             * survey, participant, device }).
             * @param {Device}  Takes the payload of a device token, derived
             *                  during the verification process.
             * @returns {Promise.Submission}    Returns a Promise that resolves
             *                                  to a Submission object, with the
             *                                  three required data sets for
             *                                  submission.
             */
            function validateSubmission(deviceTokenPayload) {
                return new Promise(
                    function(resolve, reject) {
                        if ( ! submission.survey)
                            errors.push(
                                {
                                    code: "missing_survey", 
                                    description: "Fatal: missing survey object in request."
                                }
                            );
                        if ( ! submission.participant)
                            errors.push(
                                {
                                    code: "missing_participant", 
                                    description: "Fatal: missing participant object in request."
                                }
                            );

                        if (errors.length) {
                            var combinedErrors = new Error("Multiple errors.");
                            combinedErrors.code = "multiple_errors";
                            combinedErrors.errors = errors;
                            reject(combinedErrors);
                            return;
                        }
                        
                        validation = surveyModel.validate(submission);
                        if ( ! validation.isValid) {
                            res.json({ errors: validation });
                            reject(validation);
                        }
                        
                        resolve({
                            survey: validation.survey,
                            participant: validation.participant,
                            device: deviceTokenPayload
                        })
                    }
                );
            }
            
            /**
             * Calls the SurveyModel.storeSubmission method, forwarding the
             * output to the client (using the Express.res object).
             * @param {Submission} submission   A validated submission object
             *                                  that will be stored in the
             *                                  database.
             */
            function storeSubmission(submission) {
                return new Promise(
                    function(resolve, reject) {
                        surveyModel
                            .storeSubmission(submission)
                            .then(function(result) {
                                resolve(res.json({ success: result }));
                            })
                            .catch(function(err) {
                                console.error(err);
                                reject(err);
                            });
                    }
                );
            }
            
            /**
             * Reports system (not validation) errors.
             */
            function reportErrors() {
                res.json({ errors: errors });
            }
        }
    );


module.exports = router;