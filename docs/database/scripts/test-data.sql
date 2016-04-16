--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5rc1
-- Dumped by pg_dump version 9.5rc1

-- Started on 2016-04-16 09:03:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = ephemeral, pg_catalog;

--
-- TOC entry 2180 (class 0 OID 17345)
-- Dependencies: 209
-- Data for Name: answer_set; Type: TABLE DATA; Schema: ephemeral; Owner: postgres
--

INSERT INTO answer_set (answers, name) VALUES ('[{"value": 0, "label": "Very dissatisfied"},{"value": 1, "label": "Dissatisfied"},{"value": 2, "label": "Neither satisfied nor dissatisfied"},{"value": 3, "label": "satisfied"},{"value": 4, "label": "Very satisfied"}]', 'satisfaction');
INSERT INTO answer_set (answers, name) VALUES ('[{"value": 0, "label": "Not at all"},{"value": 1, "label": "A little"},{"value": 2, "label": "A moderate amount"},{"value": 3, "label": "Very much"},{"value": 4, "label": "An extreme amount"}]', 'amount.noun');
INSERT INTO answer_set (answers, name) VALUES ('[{"value": 0, "label": "Not at all"},{"value": 1, "label": "A little"},{"value": 2, "label": "A moderate amount"},{"value": 3, "label": "Very much"},{"value": 4, "label": "Extremely"}]', 'amount.adverb');
INSERT INTO answer_set (answers, name) VALUES ('[{"value": 0, "label": "Not at all"},{"value": 1, "label": "A little"},{"value": 2, "label": "moderately"},{"value": 3, "label": "Mostly"},{"value": 4, "label": "Completely"}]', 'amount.coverage');
INSERT INTO answer_set (answers, name) VALUES ('[{"value": 0, "label": "Very poor"},{"value": 1, "label": "Poor"},{"value": 2, "label": "Neither poor nor good"},{"value": 3, "label": "Good"},{"value": 4, "label": "Very good"}]', 'quality');
INSERT INTO answer_set (answers, name) VALUES ('[{"value": 0, "label": "Never"},{"value": 1, "label": "Seldom"},{"value": 2, "label": "Quite often"},{"value": 3, "label": "Very often"},{"value": 4, "label": "Always"}]', 'frequency');


--
-- TOC entry 2178 (class 0 OID 17225)
-- Dependencies: 197
-- Data for Name: question; Type: TABLE DATA; Schema: ephemeral; Owner: postgres
--

INSERT INTO question (id, number, text, answer_set_name) VALUES (1, 1, 'How would you rate your quality of life?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (2, 2, 'How satisfied are you with your health?', 'amount.noun');
INSERT INTO question (id, number, text, answer_set_name) VALUES (3, 3, 'To what extend do you feel that physical pain prevents you from doing what you need to do?', 'amount.noun');
INSERT INTO question (id, number, text, answer_set_name) VALUES (4, 4, 'How much do you need any medical treatment to function in your life?', 'amount.noun');
INSERT INTO question (id, number, text, answer_set_name) VALUES (5, 5, 'How much do you enjoy life?', 'amount.noun');
INSERT INTO question (id, number, text, answer_set_name) VALUES (6, 6, 'To what extent do you feel your life to be meaningful?', 'amount.noun');
INSERT INTO question (id, number, text, answer_set_name) VALUES (7, 7, 'How well are you able to concentrate?', 'amount.adverb');
INSERT INTO question (id, number, text, answer_set_name) VALUES (8, 8, 'How safe do you feel in your daily life?', 'amount.adverb');
INSERT INTO question (id, number, text, answer_set_name) VALUES (9, 9, 'How healthy is your physical environment?', 'amount.adverb');
INSERT INTO question (id, number, text, answer_set_name) VALUES (10, 10, 'Do you have enough energy for everyday life?', 'amount.coverage');
INSERT INTO question (id, number, text, answer_set_name) VALUES (11, 11, 'Are you able to accept your bodily appearance?', 'amount.coverage');
INSERT INTO question (id, number, text, answer_set_name) VALUES (12, 12, 'Do you have enough money to fit your needs?', 'amount.coverage');
INSERT INTO question (id, number, text, answer_set_name) VALUES (13, 13, 'How available to you is information that you need in your day-to-day life?', 'amount.coverage');
INSERT INTO question (id, number, text, answer_set_name) VALUES (14, 14, 'To what extent do you have the opportunity for leisure activities?', 'amount.coverage');
INSERT INTO question (id, number, text, answer_set_name) VALUES (15, 15, 'How well are you able to get around?', 'quality');
INSERT INTO question (id, number, text, answer_set_name) VALUES (16, 16, 'How satisfied are you with your sleep?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (17, 17, 'How satisfied are you with your ability to perform your daily living activities?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (18, 18, 'How satisfied are you with your capacity to work?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (19, 19, 'How satisfied are you with yourself?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (20, 20, 'How satisfied are you with your personal relationships?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (22, 21, 'How satisfied are you with your sex life?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (23, 22, 'How satisfied are you with the support you get from your friends?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (24, 23, 'How satisfied are you with the conditions of your living space?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (25, 24, 'How satisfied are you with your access to health services?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (26, 25, 'How satisfied are you with your transport?', 'satisfaction');
INSERT INTO question (id, number, text, answer_set_name) VALUES (27, 26, 'How often do you have negative feelings such as blue mood, despair, anxiety, depression?', 'frequency');


--
-- TOC entry 2188 (class 0 OID 0)
-- Dependencies: 196
-- Name: question_id_seq; Type: SEQUENCE SET; Schema: ephemeral; Owner: postgres
--

SELECT pg_catalog.setval('question_id_seq', 27, true);


-- Completed on 2016-04-16 09:03:51

--
-- PostgreSQL database dump complete
--

