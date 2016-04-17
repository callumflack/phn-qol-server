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
dotenv.config({silent: true});

describe("PHN QoL Server testing", function() {
    describe("Platform tests", require('./system/system-tests'));
    describe("Unit tests", function(done) {});
    describe("Integration tests", require('./integration/integration-tests'));
});
