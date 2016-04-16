/**
 * Questions route
 * 
 * This Express.js route can be used to request questions for the Quality of
 * Life survey along with their corresponding answer sets.
 * 
 * @author Kashi Samaraweera
 * @version 0.1.0
 */

var express = require('express');
var router = express.Router();

router.get(
    '/',
    (req, res, next) => {
        var pg = require('../util/db-conn').pg;
        var db = require('../util/db-conn').db;

        db.query('SELECT * FROM testing_27.question')
        .then(outputQuestions)
        .catch((err) => { console.log (err); });

        /**
         * Renders the list of questions along with their individual answers as
         * a JSON object. 
         */
        function outputQuestions(data) {
            var questions = data;
            res.json(data);
            pg.end();
        }
    }
);


module.exports = router;