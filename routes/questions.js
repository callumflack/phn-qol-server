/**
 * Questions route
 * 
 * This Express.js router can be used to request questions for the Quality of
 * Life survey along with their corresponding answer sets. Seeing as this is
 * read-only information, POST, PUT, DELETE, etc. are not implemented.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
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
              schema_name.question.id,
              schema_name.question.number,
              schema_name.question.text,
              schema_name.question.answer_set_name,
              schema_name.answer_set.answers
            FROM schema_name.question
            JOIN schema_name.answer_set
              ON schema_name.answer_set.name = schema_name.question.answer_set_name
            ORDER BY schema_name.question.number ASC;
        `.replace(/schema_name/g, dbConn.schema))
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