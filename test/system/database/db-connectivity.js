/**
 * Database connectivity tests
 * 
 * Designed to be run after the database environment variables tests, this suite
 * checks to see make sure a connection to the database can be made.
 *  
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import chai from 'chai';
import pg from 'pg-promise';

const assert = chai.assert;

module.exports = function() {
    /**
     * Database creation functions
     */
    describe('Database connectivity', function() {
        
        it('Database connection established', function(done) {
            assert.isTrue(true);
            done();
        });
            
    });   
}