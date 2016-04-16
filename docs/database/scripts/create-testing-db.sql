
DROP SCHEMA IF EXISTS ephemeral CASCADE;
CREATE SCHEMA ephemeral;

ALTER DATABASE phn-qol-survey SET search_path = ephemeral;

CREATE TABLE ephemeral.answer_set (
                name VARCHAR(35) NOT NULL,
                answers JSON NOT NULL,
                CONSTRAINT answer_set_pk PRIMARY KEY (name)
);


CREATE UNIQUE INDEX answer_set_uq_name
 ON ephemeral.answer_set
 ( name );

CREATE SEQUENCE ephemeral.question_id_seq;

CREATE TABLE ephemeral.question (
                id INTEGER NOT NULL DEFAULT nextval('ephemeral.question_id_seq'),
                number INTEGER,
                text VARCHAR NOT NULL,
                answer_set_name VARCHAR(35) NOT NULL,
                CONSTRAINT question_pk PRIMARY KEY (id)
);


ALTER SEQUENCE ephemeral.question_id_seq OWNED BY ephemeral.question.id;

CREATE SEQUENCE ephemeral.provider_id_seq;

CREATE TABLE ephemeral.provider (
                id INTEGER NOT NULL DEFAULT nextval('ephemeral.provider_id_seq'),
                code VARCHAR(25) NOT NULL,
                region VARCHAR(50) NOT NULL,
                location VARCHAR(50) NOT NULL,
                CONSTRAINT provider_idx PRIMARY KEY (id)
);


ALTER SEQUENCE ephemeral.provider_id_seq OWNED BY ephemeral.provider.id;

CREATE TABLE ephemeral.device (
                guid VARCHAR(64) NOT NULL,
                registered TIMESTAMP DEFAULT LOCALTIMESTAMP NOT NULL,
                provider_id INTEGER NOT NULL,
                ip_address VARCHAR(40) NOT NULL,
                name VARCHAR(50) NOT NULL,
                status VARCHAR(20) NOT NULL,
                CONSTRAINT device_pk PRIMARY KEY (guid)
);


CREATE SEQUENCE ephemeral.age_bracket_id_1;

CREATE TABLE ephemeral.age_bracket (
                id SMALLINT NOT NULL DEFAULT nextval('ephemeral.age_bracket_id_1'),
                min SMALLINT,
                max SMALLINT,
                CONSTRAINT min_age PRIMARY KEY (id)
);


ALTER SEQUENCE ephemeral.age_bracket_id_1 OWNED BY ephemeral.age_bracket.id;

CREATE SEQUENCE ephemeral.participant_id_seq;

CREATE TABLE ephemeral.participant (
                id INTEGER NOT NULL DEFAULT nextval('ephemeral.participant_id_seq'),
                gender VARCHAR(20) NOT NULL,
                education VARCHAR(50) NOT NULL,
                age_bracket_id SMALLINT NOT NULL,
                indigenous BOOLEAN NOT NULL,
                healthcare_region VARCHAR(50) NOT NULL,
                session_number SMALLINT DEFAULT 1 NOT NULL,
                CONSTRAINT participant_pk PRIMARY KEY (id)
);


ALTER SEQUENCE ephemeral.participant_id_seq OWNED BY ephemeral.participant.id;

CREATE SEQUENCE ephemeral.submission_id_seq;

CREATE TABLE ephemeral.submission (
                id INTEGER NOT NULL DEFAULT nextval('ephemeral.submission_id_seq'),
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                participant_id INTEGER NOT NULL,
                device_guid VARCHAR(64) NOT NULL,
                provider_id INTEGER NOT NULL,
                CONSTRAINT submission_idx PRIMARY KEY (id)
);


ALTER SEQUENCE ephemeral.submission_id_seq OWNED BY ephemeral.submission.id;

CREATE TABLE ephemeral.question_response (
                submission_id INTEGER NOT NULL,
                question_id INTEGER NOT NULL,
                response SMALLINT NOT NULL,
                CONSTRAINT question_response_pk PRIMARY KEY (submission_id, question_id)
);


ALTER TABLE ephemeral.question ADD CONSTRAINT answer_set_question_fk
FOREIGN KEY (answer_set_name)
REFERENCES ephemeral.answer_set (name)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE ephemeral.question_response ADD CONSTRAINT question_question_response_fk
FOREIGN KEY (question_id)
REFERENCES ephemeral.question (id)
ON DELETE CASCADE
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE ephemeral.submission ADD CONSTRAINT provider_submission_fk
FOREIGN KEY (participant_id)
REFERENCES ephemeral.provider (id)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE ephemeral.device ADD CONSTRAINT provider_device_fk
FOREIGN KEY (provider_id)
REFERENCES ephemeral.provider (id)
ON DELETE CASCADE
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE ephemeral.submission ADD CONSTRAINT device_submission_fk
FOREIGN KEY (device_guid)
REFERENCES ephemeral.device (guid)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE ephemeral.participant ADD CONSTRAINT age_bracket_participant_fk
FOREIGN KEY (age_bracket_id)
REFERENCES ephemeral.age_bracket (id)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE ephemeral.submission ADD CONSTRAINT participant_submission_fk
FOREIGN KEY (participant_id)
REFERENCES ephemeral.participant (id)
ON DELETE RESTRICT
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE ephemeral.question_response ADD CONSTRAINT submission_question_response_fk
FOREIGN KEY (submission_id)
REFERENCES ephemeral.submission (id)
ON DELETE CASCADE
ON UPDATE CASCADE
NOT DEFERRABLE;