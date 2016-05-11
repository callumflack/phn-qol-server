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
                .then((deviceTokenData) => deviceInfo = deviceTokenData)
                .catch((err) => errors.push(err));

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
            if (errors.length)
                return res.json({ errors: errors });
            
            validation = surveyModel.validate(submission);
            if (validation.length) {
                return res.json({ errors: validation });
            }

            res.json(submission);
        }
    );


module.exports = router;