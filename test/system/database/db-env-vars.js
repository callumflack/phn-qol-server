/**
 * Database environment variable tests
 * 
 * Checks to see that the connection details as well as the requisite
 * credentials for logging into the PostgreSQL server is present in the 
 * environment.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import request from 'supertest';
import chai from 'chai';

const assert = chai.assert;

module.exports = function() {
    describe('Environment variables setup', function() {    
        /**
         * Test 1: Hostname
         */
        it('PostgreSQL DB_HOSTNAME set', function(done) {
            assert.isDefined(process.env.DB_HOSTNAME);
            done();
        });
        
        /**
         * Test 2: Username
         */
        it('PostgreSQL DB_USERAME set', function(done) {
            assert.isDefined(process.env.DB_USERNAME);
            done();
        });
        
        /**
         * Test 2: Password
         */
        it('PostgreSQL DB_PASSWORD set', function(done) {
            assert.isDefined(process.env.DB_PASSWORD);
            done();
        });
        
        /**
         * Test 2: Database
         */
        it('PostgreSQL DB_DATABASE set', function(done) {
            assert.isDefined(process.env.DB_DATABASE);
            done();
        });
    });
}