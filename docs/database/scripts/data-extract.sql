SELECT
    submission.time AS submitted,
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
    FROM epehemeral.crosstab(
      $$ SELECT submission_id, question_id, response FROM epehemeral.question_response ORDER BY 1 $$,
      $$ SELECT m FROM generate_series(1,26) m $$
    ) AS (
      submission_id int, "q1" int, "q2" int, "q3" int, "q4" int, "q5" int, "q6" int, "q7" int, "q8" int, "q9" int, "q10" int, "q11" int, "q12" int,
      "q13" int, "q14" int, "q15" int, "q16" int, "q17" int, "q18" int, "q19" int, "q20" int, "q21" int, "q22" int, "q23" int, "q24" int, "q25" int,
      "q26" int
    ) 
) answers
JOIN epehemeral.submission ON submission.id = answers.submission_id
JOIN epehemeral.participant ON submission.participant_id = participant.id
JOIN epehemeral.provider ON submission.provider_id = provider.id;