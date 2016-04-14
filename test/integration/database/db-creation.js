/**
 * Database creation tests
 * 
 * This suite runs the SQL generations scripts on an ephemeral database schema
 * (i.e., one that is designed to be blown away after testing). This will test
 * bot the schema creation as well as checking test data insertion scripts
 * populate each table with an adaquate number of rows.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import pg from 'pg-promise';

/**
 * Database creation functions
 */
module.exports = function() { 

    describe('Database creation', function() {
        
        it('Database creation executes', function(done) {
            done();
        });
            
    });
    
}