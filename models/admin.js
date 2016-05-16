/**
 * Admin model
 * PHN QoL Server
 * 
 * Manages JWT token issuance and CSV generation.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

const JWT_KEY = process.env.JWT_KEY;
const SERVER_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

/**
 * @typedef {object} ValidationError
 * @property {string} input The input name being validated.
 * @property {string} error The error raised by the validation.
 */
var AdminModel = {
    /**
     * Generates a JWT token for the device, which may be used to authenticate
     * survey submissions.
     * @param {Device} device   The device information, along with the UUID
     *                          stored in the database.
     * @return {Promise.string} Returns a JSON Web Token which may be stored by
     *                          the client for survey authentication.
     */
    issueToken: function(device) {
        var jwt = require('jsonwebtoken'),
            tokenData = {
                admin: true
            },
            tokenOptions = {
                issuer: SERVER_URL,
                audience: CLIENT_URL,
                expiresIn: 1000*60*10, // 10 mins
                notBefore: 0
            }
        
        return new Promise(function(resolve, reject) {
            jwt.sign(
                tokenData,
                JWT_KEY,
                tokenOptions,
                function(token) { resolve(token); return; }
            );
        });
    },
    /**
     * Takes a JWT token (encoded), decodes and verifies it for authenticity.
     * @param {string} tokenString  The encoded JWT token.
     * @return {Promise.boolean}    Returns a boolean TRUE or FALSE based on the
     *                              verification against the JWT key.
     */
    verifyToken: function(tokenString) {
        return new Promise(function (resolve, reject) {
            var jwt = require('jsonwebtoken');
            jwt.verify(
                tokenString,
                JWT_KEY,
                {
                    issuer: SERVER_URL,
                    audience: CLIENT_URL
                },
                returnVerification
            );

            function returnVerification(err, result) {
                if (err) { reject(err); return; }
                if (!result.admin) { reject(err); return; }
                resolve(result); return;
            }
        });
    },
    submissionData: function() {
        var dbConn = require('../util/db-conn'),
            db = dbConn.db;

        var reportSql = `
            SELECT
                to_char(submission.time, 'YYYY-MM-DD') AS submitted,
                provider.code AS provider_code,
                provider.region AS region,
                participant.gender,
                participant.education,
                participant.age_bracket_id AS age_group,
                participant.indigenous,
                participant.session_number AS sessions,
                q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,
                q21,q22,q23,q24,q25,q26
            FROM (
                SELECT
                    submission_id,
                    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                    q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,
                    q21,q22,q23,q24,q25,q26
                FROM schema_name.crosstab(
                    $$ SELECT submission_id, question_id, response 
                      FROM schema_name.question_response ORDER BY 1 $$,
                    $$ SELECT m FROM generate_series(1,26) m $$
                ) AS (
                    submission_id int, "q1" int, "q2" int, "q3" int, "q4" int,
                    "q5" int, "q6" int, "q7" int, "q8" int, "q9" int, "q10" int,
                    "q11" int, "q12" int, "q13" int, "q14" int, "q15" int,
                    "q16" int, "q17" int, "q18" int, "q19" int, "q20" int,
                    "q21" int, "q22" int, "q23" int, "q24" int, "q25" int, "q26" int
                ) 
            ) answers
            JOIN schema_name.submission ON submission.id = answers.submission_id
            JOIN schema_name.participant 
                ON submission.participant_id = participant.id
            JOIN schema_name.provider ON submission.provider_id = provider.id;`
            .replace(/schema_name/g, dbConn.schema)
            .replace(/\n/g, "");

        return db.many(reportSql);           
    }
};

module.exports = AdminModel;