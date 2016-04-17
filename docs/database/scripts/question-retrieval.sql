# Used to get a full list of questions in their numbered order;
SELECT
  question.id,
  question.number,
  question.text,
  question.answer_set_name,
  answer_set.answers
FROM question
JOIN answer_set ON answer_set.name = question.answer_set_name
ORDER BY question.number ASC;
