/**
 * Questions route
 * 
 * This Express.js route can be used to request questions for the Quality of
 * Life survey along with their corresponding answer sets. Seeing as this is
 * read-only information, POST, PUT, DELETE, etc. are not implemented.
 * 
 * @author Kashi Samaraweera
 * @version 0.1.0
 */

var express = require('express');
var router = express.Router();

router.get(
    '/',
    (req, res, next) => {
        var dbConn = require('../util/db-conn'),
            pg = dbConn.pg,
            db = dbConn.db;

        db.query(`
            SELECT
              question.id,
              question.number,
              question.text,
              question.answer_set_name,
              answer_set.answers
            FROM question
            JOIN answer_set ON answer_set.name = question.answer_set_name
            ORDER BY question.number ASC;
        `)
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