/**
 * API Callback route
 * 
 * This Express.js router is used by the Telstra SMS API to provide feedback for
 * SMS send commands.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

var express = require('express');
var router = express.Router();

router
    .post(
        '/',
        /**
         * Processes a new submission to the survey, accepting a set of question
         * responses.
         */
        (req, res, next) => {
            console.log(res.headers);
            console.log(res.body);
            res.json({ result: "thank you." });
        }
    );


module.exports = router;