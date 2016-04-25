/**
 * Test scheduler
 * 
 * As the suite of tests for this project are extensive, and cover a range of
 * layers from platform to application and unit, the order that tests are 
 * conducted are of particular importance.
 * 
 * Rather than running tests in whatever order Mocha deems suitable nor
 * resorting to using file naming conventions to convolute the tests directory
 * we'll be using the following scheduler to dictate the order in which tests
 * will be run, with special attention given to dependency (eg.: environment
 * variables for database connectivity being available before testing database
 * connectivity.)
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

import dotenv from 'dotenv';
process.env.NODE_ENV = 'test';

// Find our environment variables file
const defaultEnvPath = './.env.test-local'
dotenv.config({
    path: process.env.DOTENV_PATH || defaultEnvPath,
    silent: true
});

// Export the DB_SCHEMA environment variable
var circleBuildNum = process.env.CIRCLE_BUILD_NUM || false,
    schemaName = 'testing_',
    randomSchemaName = Math
        .random()
        .toString(36)
        .replace(/[^a-zA-Z]/g, '');

schemaName += circleBuildNum || randomSchemaName;
process.env["DB_SCHEMA"] = schemaName;

describe("PHN QoL Server testing", function() {
    describe("Platform tests", require('./system/system-tests'));
    describe("Test setup", require('./setup/test-setup'));
    describe("Unit tests",  require('./unit/unit-tests'));
    describe("Integration tests", require('./integration/integration-tests'));
    describe("Test teardown", require('./setup/test-teardown'));
});
