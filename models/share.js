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

var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

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
            var method;
            if (/^[0-9]{10}|\+61[0-9]{8,9}|00[0-9]{8,9}$/.test(address))
                method = "sms";

            if (EMAIL_REGEX.test(address))
                method = "email";
                
            if (method === undefined) {
                var addressError = new Error(
                    "Could not validate address as email or phone number.");
                addressError.code = "invalid_address";
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
                    questionResponses.push(responseObj.response);
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
        return this.getScores(submissionId)
            .then(issueSmsSendRequest);

        /**
         * Simple request to the Telstra SMS API in order to send a message. 
         */
        function issueSmsSendRequest(scores) {
            return new Promise(function(resolve, reject) {
                resolve("Sent SMS to " + phoneNum);
            });
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
            .then(compileEmail);

        /**
         * Assembles our email message using the scores supplied.
         */
        function compileEmail(scores) {
            return new Promise(function(resolve, reject) {
                resolve("The email body. Your scores are as follows:" + JSON.stringify(scores));
            });
        }
        
        /**
         * Sends the email.
         */
        function sendEmail(emailBody) {
            return new Promise()
        }
    }
};

module.exports = ShareModel;