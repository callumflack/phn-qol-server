/**
 * Share model
 * PHN QoL Survey
 * 
 * Implements the sharing functions of the final score that is calucalted within
 * the Survey model. This method handles the perperating and parsing of messages
 * passed between the PHN QoL Server and the Telstra API (for SMS); and also the
 * prepration of emails sent by the server.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var surveyModel = require('./survey');
var rp = require('request-promise');
var fs = require('fs');

var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var PHONE_REGEX = /^[0-9]{10}|\+61[0-9]{8,9}|00[0-9]{8,9}$/;

var TDEV_TOKEN_URL = "https://api.telstra.com/v1/oauth/token";
var TDEV_SMS_URL = "https://api.telstra.com/v1/sms/messages";

var EMAIL_TEMPLATES = "./views/messaging/email/share-scores";

/**
 * @typedef EmailBody
 * @param {String} html The HTML version of the email message to be sent out.
 * @param {String} plain    The plaintext version of the email to be sent.
 */

var ShareModel = {
    /**
     * Parses an address as supplied by the app, resolving to method (SMS or 
     * email).
     * @param {String} address  The addressee of the shared item. This address
     *                          is parsed to discern either an email address or
     *                          phone number.
     * @return {Promise.String} Returns "email" if the supplied address is
     *                          an email, or "sms" if its a phone number.
     */
    validateAddress: function(address) {
        return new Promise(function(resolve, reject) {
            if ( ! address) {
                var addressError = new Error("Missing address for sharing.");
                addressError.code = "address_missing";
                reject(addressError);
                return;
            }
            var method;
            if (PHONE_REGEX.test(address))
                method = "sms";

            if (EMAIL_REGEX.test(address))
                method = "email";
                
            if (method === undefined) {
                var addressError = new Error(
                    "Could not validate address as email or phone number.");
                addressError.code = "address_invalid";
                reject(addressError);
                return;
            }

            resolve(method);
        });
    },
    /**
     * Uses the Survey model to fetch the submission details and participant's
     * responses, feeding that back into the Survey model to generate the scores
     * that will be sent to the recipient.
     * @param {Number} submissionId The ID of the submission to be sent.
     * @return {Promise.Scores} The scores object, containing each of the four
     *                          score categories.
     */
    getScores: function(submissionId) {
        return surveyModel
            .getSurveySubmission(submissionId)
            .then(assessSubmision);

        function assessSubmision(submission) {
            return new Promise(function(resolve, reject) {
                var survey = submission.survey,
                    questionResponses = [],
                    scores;
                
                survey.map(function(responseObj) {
                    questionResponses.push(responseObj.response - 1);
                });
                
                scores = surveyModel.calculateScores(questionResponses);
                
                resolve(scores);
            });
        }
    },
    /**
     * Sends an SMS to the supplied number by calling the send API endpoint on
     * Telstra DEV. This will require the environment variables TDEV_API_KEY
     * and TDEV_API_SECRET to be defined.
     * @param {Number} submissionId The ID of the submission for which to
     *                              retrieve the scores.
     * @param {String} phoneNum A well-formed mobile phone number to send the
     *                          scores to.
     * @return {Promise.boolean}    Returns TRUE if the SMS send command worked,
     *                              FALSE if not.
     */
    sendSms: function(submissionId, phoneNum) {
        var scores;

        return this.getScores(submissionId)
            .then(prettifyScores)
            .then(this.getTdevToken)
            .then(issueSmsSendRequest);

        function prettifyScores(retrievedScores) {
            return new Promise(function(resolve) {
                var prettyScores = {
                    physical: Math.round(retrievedScores.physical * 20),
                    psych: Math.round(retrievedScores.psych * 20),
                    social: Math.round(retrievedScores.social * 20),
                    environment: Math.round(retrievedScores.environment * 20)
                }
                scores = prettyScores;
                resolve();
            });
        }
        /**
         * Simple request to the Telstra SMS API in order to send a message. 
         */
        function issueSmsSendRequest(tdevToken) {
            var smsSendRequest = {
                    uri: TDEV_SMS_URL,
                    method: 'POST',
                    body: {
                        to: phoneNum
                    },
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + tdevToken
                    },
                    json: true
                },
                smsBody;
            
            smsBody = [
                "Your NQPHN Quality of Life survey score:",
                "1. Physical Health: " + scores.physical + "% (average: 74%)",
                "2. Psychological: " + scores.psych + "% (71%)",
                "3. Social: " + scores.social + "% (72%)",
                "4. Environmental: " + scores.environment + "% (75%)"
            ].join("\n");

            smsSendRequest.body.body = smsBody;
            
            return rp(smsSendRequest);
        }
    },
    /**
     * Telstra's SMS API requires both the API key / secret pair and separately
     * a token exchanged for the key/secret which is valid for a set amount of
     * time.
     * This method manages the state of the access token, requesting a new one
     * if the last one has expired or does not exist.
     */
    getTdevToken: function() {
        var token = process.env["TDEV_ACCESS_TOKEN"],
            tokenExpiry = process.env["TDEV_ACCESS_TOKEN_EXP"];
        
        if (token === undefined || isNaN(tokenExpiry))
            return getNewToken();

        return validateToken()
            .catch(getNewToken);
        
        /**
         * Simple timestamp check (JavaScript's milliseconds from epoch) to see
         * if a new token is necessary.
         */
        function validateToken() {
            return new Promise(function(resolve, reject) {
                tokenExpiry = parseInt(tokenExpiry);
                if (tokenExpiry >= Date.now())
                    reject();
                resolve(token);
            });
        }
        
        /**
         * Applies to the TDEV API to retrieve a new token for the SMS API,
         * exporting the resultant access token and its expiry time (converted
         * into milliseconds from epoch) as an evironment variable.
         */
        function getNewToken() {
            var tdevTokenRequest = {
                uri: TDEV_TOKEN_URL,
                qs: {
                    client_id: process.env.TDEV_API_KEY,
                    client_secret: process.env.TDEV_API_SECRET,
                    grant_type: "client_credentials",
                    scope: "SMS"
                },
                json: true
            };

            return rp(tdevTokenRequest)
                .then(storeToken);
            
            function storeToken(tokenData) {
                var token = tokenData.access_token,
                    expiry = Math.floor( Date.now() / 1000 ) + tokenData.expiry;

                process.env.TDEV_ACCESS_TOKEN = token;
                process.env.TDEV_ACCESS_TOKEN_EXP = expiry * 1000;
                
                return new Promise(function(resolve) { resolve(token); });
            }
        }
        
    },
    /**
     * Compiles and sends an email to the supplied email address using an
     * external SMTP server.
     * @param {Number} submissionId The ID of the submission for which to
     *                              retrieve the scores.
     * @param {String} emailAddress A well-formed email address to send the
     *                              scores to.
     * @return {Promise.boolean}    Returns TRUE if the send command worked,
     *                              FALSE if not.
     */
    sendEmail: function(submissionId, emailAddress) {
        return this.getScores(submissionId)
            .then(compileEmail)
            .then(sendEmail);

        /**
         * Loads the email template files, replacing custom tags with score data
         * before finally forwarding the `plain` and `html` bodies of the email
         * to the next handler.
         * @param {Scores} scores   The scores derived from the user's response.
         * @returns {Promise.EmailBody} The HTML/plaintext pair of email bodies.
         */
        function compileEmail(scores) {
            return new Promise(function(resolve, reject) {
                var emailBodies = {};

                // Load each of the template files:
                fs.readFile(EMAIL_TEMPLATES + '.html', 'UTF8', getPlainText);
                
                /**
                 * Callback for the HTML email file reader. Stores the email
                 * body in the emailBodies object and proceeds to fetch the
                 * plaintext email.
                 */
                function getPlainText(err, html) {
                    if (err) { reject(err); return; }
                    emailBodies.html = html;
                    fs.readFile(EMAIL_TEMPLATES + '.txt', 'UTF8', gatherEmails);
                }
                
                /**
                 * Callback for the plain text email file reader. Arranges the
                 * email bodies into an object, replacing the keywords for score
                 * results.
                 */
                function gatherEmails(err, plain) {
                    if (err) { reject(err); return; }
                    emailBodies.plain = plain;

                    var replacements = {
                        "{{scores.physical}}": Math.round(scores.physical * 20),
                        "{{scores.psych}}": Math.round(scores.psych * 20),
                        "{{scores.social}}": Math.round(scores.social * 20),
                        "{{scores.environment}}": Math.round(scores.environment * 20)
                    }
                    
                    for (var prop in replacements) {
                        if ( ! replacements.hasOwnProperty(prop)) continue;
                        emailBodies.html = emailBodies.html
                            .replace(prop, replacements[prop]);
                        emailBodies.plain = emailBodies.plain
                            .replace(prop, replacements[prop]);
                    }

                    resolve(emailBodies);
                }
            });
        }
        
        /**
         * Sends the email.
         */
        function sendEmail(emailBody) {
            return new Promise(function(resolve, reject) {
                var emailError = new Error("No email service provider.");
                emailError.code = "not_implemented";
                reject(emailError);
            });
        }
    }
};

module.exports = ShareModel;