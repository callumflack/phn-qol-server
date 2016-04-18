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
            res.json({ a: "Thank you for your submission." });
        }
    );


module.exports = router;