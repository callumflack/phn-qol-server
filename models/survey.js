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
 * @property {string} healthcareRegion  The PHN reigon under which the
 *                                      participant is afforded healthcare.
 * @property {Number} sessionNo The number of submissions this participant has
 *                              taken part in.
 */
/**
 * @typedef QValidationIssue
 * @property {Number} questionId    The ID of the question for which the issue
 *                                  applies.
 * @property {string} code  The error code identifying the validation issue.
 * @property {string} message   A brief description of the issue.
 */

/** A list of question IDs to verify coverage. */
const QUESTION_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
                        23,24,25,26];

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

        validation.survey = validateSurvey(submission.survey);
        validation.participant = validateParticipant(submission.participant);

        submission.validation = validation;

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
    validateParticipant: function(participant) {
        
    }
};

module.exports = SurveyModel;