/**
 * Survey model
 * 
 * Handles the validation and saving of a survey submission. This includes
 * validating the survey responses as well as the "About you" questions.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

/**
 * @typedef Submission
 * @property {QuestionResponse[]} survey  An array of survey responses holding the
 *                                      user's question responses.
 * @property {Participant} participant  The user's "About you" responses.
 */
/**
 * @typedef QuestionResponse
 * @property {Number} questionId    The Id of the question in the database.
 * @property {Number} response  The survey participant's response to the
 *                              question.
 */
/**
 * @typedef Participant
 * @property {Number} id    The ID (if set) of the participant in the database.
 *                          If the participant's details have not yet been saved
 *                          then this will be `undefined`.
 * @property {string} gender    The participant's gender.
 * @property {string} education The level of education that the participant has
 *                              received.
 * @property {Number} ageBracket    The ID of the age bracket (as defined in the
 *                                  age_bracket table in the database).
 * @property {boolean} indigenous   Indicates whether the participant is an
 *                                  indigenous Australian.
 * @property {string} region    The PHN reigon under which the participant is
 *                              provided healthcare.
 * @property {Number} sessionNumber The number of submissions this participant
 *                                  had taken part in.
 */
/**
 * @typedef QValidationIssue
 * @property {Number} questionId    The ID of the question for which the issue
 *                                  applies.
 * @property {string} code  The error code identifying the validation issue.
 * @property {string} message   A brief description of the issue.
 */
/**
 * @typedef PValidationIssue
 * @property {string} input The specific question being validated (by name).
 * @property {string} code  The error code identifying the validation issue.
 * @property {string} message   A brief description of the issue.
 */

/** A list of question IDs to verify coverage. */
const QUESTION_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
                        23,24,25,26];
const PARTICIPANT_FIELDS = ["gender", "ageGroup", "education", "indigenous",
                            "region", "sessionNumber"];

var SurveyModel = {
    /**
     * Takes a survey submission and validates its components `survey` and 
     * `participant`. The submission object is decorated with validation results
     * before being returned in full.
     * 
     * @param {Submission} submission   The survey submission (with both survey
     *                                  and participant components) to validate.
     * @retun {Submission}  Returns the same submission with an additional
     *                      property for the validation results.
     */
    validate: function(submission) {
        var validation = {};

        validation.survey = this.validateSurvey(submission.survey);
        validation.participant = this.validateParticipant(submission.participant);

        submission.validation = validation;
        submission.isValid = validation.survey.length === 0
                                && validation.participant.length === 0;

        return submission;
    },
    /**
     * Takes an array of survey question responses (`QuestionResponse`) and
     * checks to see that it is a complete set and that each question contains a
     * valid response.
     * 
     * To check that each question has been answered, a copy of the QUESTION_IDS
     * array is made and as question responses are assessed the ID of that
     * question is removed from the copy.
     * 
     * @param {QuestionResponse[]} survey   An array of question responses to
     *                                      validate for completeness and
     *                                      correctness in response (0..4).
     * @return {QValidationIssue[]} Returns an array of validation issues.
     */
    validateSurvey: function(survey) {
        var questionCoverage = QUESTION_IDS.slice(0),
            validation = [];
        
        // Validate the supplied question responses.
        survey.forEach(function(qResponse) {
            if (qResponse.response < 0 || qResponse.response > 4)
                validation.push({
                    questionId: qResponse.questionId,
                    code: "out_of_bounds",
                    message: "The response was not between [0,4]."
                });
            // Mark this question as complete (remove it fro questionCoverage).
            var qIndex = questionCoverage.indexOf(qResponse.questionId);
            questionCoverage.splice(
                questionCoverage.indexOf(qResponse.questionId), 1
            );
        });
        
        // Add in validation errors for those that weren't supplied.
        questionCoverage.forEach(function(questionId) {
            validation.push({
                questionId: questionId,
                code: "missing",
                message: "No response provided for this question."
            })
        });
        
        return validation;
    },
    /**
     * Validates the participant's "About you" responses, producing an array of
     * validation issues for each invalid property.
     * @param {Participant} participant The participant's "About you" responses.
     * @return {PValidationIssue[]} Returns an array of validation issues.
     */
    validateParticipant: function(participant) {
        var validation = [],
            missingFields = [],
            fields = PARTICIPANT_FIELDS.slice(0);
        
        // Basic checks ("missing")
        fields.forEach(function(fieldName) {
            if ( ( ! participant[fieldName]) || participant[fieldName] === "") {
                validation.push({
                    input: fieldName,
                    code: "missing",
                    message: "Please supply an answer."
                });
                missingFields.push(fieldName);
            }
        });
        // Advanced checks
        // Gender
        if (missingFields.indexOf("gender") === -1)
            if ( ! /(fe)?male/i.test(participant.gender))
                validation.pushs({
                    input: "gender",
                    code: "invalid_gender",
                    message: "Please select either male or female."
                });

        // Age group
        if (missingFields.indexOf("ageGroup") === -1)
            if (participant.ageGroup < 1 || participant.ageGroup > 7)
                validation.push({
                    input: "ageGroup",
                    code: "invalid_age_group",
                    message: "Please choose an age group between 1 and 7."
                });

        return validation;
    },
    /**
     * Takes a validated submission and stores it in the database.
     * 
     * @param {Submission} submission   A validated submission object.
     * @return {Promise.boolean}    Returns a boolean TRUE if the submission was
     *                              stored successfully, an error if not.
     */
    storeSubmission: function(submission) {
        var dbConn = require('../util/db-conn'),
            db = dbConn.db,
            participant = submission.participant,
            device = submission.device,
            survey = submission.survey;
        
        return this.translateAgeGroup(participant.ageGroup)
            .then(function(ageGroupId) {
                participant.ageGroup = ageGroupId;
                return new Promise(function(resolve, reject) {
                   resolve(); 
                });
            })
            .then(storeTransaction);

        // Make this a transaction.
        function storeTransaction() {
            return db.tx(function(t) {
                // Add participant
                return t.one(
                    `
                        INSERT INTO schema_name.participant
                        (gender, education, age_bracket_id, indigenous,
                        healthcare_region, session_number)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING id
                    `.replace(/schema_name/g, dbConn.schema),
                    [ 
                        participant.gender, participant.education,
                        participant.ageGroup, participant.indigenous,
                        participant.region, participant.sessionNumber
                    ]
                ).then(function(pRow) {
                    // Insert submission
                    return t.one(
                        `
                            INSERT INTO schema_name.submission
                            (time, participant_id, device_guid, provider_id)
                            VALUES (NOW(), $1, $2, $3)
                            RETURNING id
                        `.replace(/schema_name/g, dbConn.schema),
                        [
                            pRow.id, device.uuid, device.provider.id
                        ]
                    );
                }).then(function(submissionRow) {
                    // Arrange each of the answers into an insertion.
                    var submissionRows = [];
                    submission.survey.forEach(function(questionResponse, questionId) {
                        submissionRows.push(
                            t.none(
                                `
                                    INSERT INTO schema_name.question_response
                                    (submission_id, question_id, response)
                                    VALUES ($1, $2, $3)
                                `.replace(/schema_name/g, dbConn.schema),
                                [
                                    submissionRow.id, questionId + 1,
                                    questionResponse + 1
                                    
                                ]
                            )
                            .catch((err) => console.error(err))
                        );
                    });
                    return t.batch(submissionRows);
                })
                .catch((err) => console.log(err));
            });
        }
    },
    /**
     * Takes an age group as a string, resolving it to an available age group 
     * in the database table `age_bracket`.
     * @param {String} ageGroup Takes the age group as submitted, typically this
     *                          contains an upper and lower bound separated by a
     *                          hyphen.
     * @return {Promise.Number} Returns the a value corresponding to the correct
     *                          `DB_SCHEMA.age_bracket.id` from the database.
     */
    translateAgeGroup: function(ageGroup) {
        var dbConn = require('../util/db-conn'),
            db = dbConn.db;

        return new Promise(function(resolve, reject) {
            var ageParts = ageGroup.split('–'),
                ageAverage;
            
            if (ageParts.length === 1)
                ageAverage = parseInt(ageParts[0]);
            if (ageParts.length === 2)
                ageAverage = (parseInt(ageParts[0]) + parseInt(ageParts[1])) / 2;
            
            if (isNaN(ageAverage)) return reject(function() {
                var ageError = new Error(
                    "Invalid ageGroup string provided ('" + ageGroup + "').");
                ageError.code = "invalid_age_group";
                return ageError;
            }()); 
       
            ageAverage = Math.round(ageAverage);
            return db.one(
                `
                    SELECT id, min, max
                    FROM development.age_bracket
                    WHERE max >= $1
                    ORDER BY max ASC
                    LIMIT 1
                `.replace(/schema_name/g, dbConn.schema),
                [ ageAverage ]
            )
            .then(returnAgeRowId)
            .catch((err) => reject(err));
            
            function returnAgeRowId(ageBracketRow) {
                resolve(ageBracketRow.id);
            }
        });
    }
};

module.exports = SurveyModel;