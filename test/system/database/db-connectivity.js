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
            this.timeout(10000);
            const dbConn = {
                host: process.env.DB_HOSTNAME,
                database: process.env.DB_DATABASE,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT || 5432,
                ssl: process.env.DB_SSL==="true" || false
            };
            const pgdb = pg()(dbConn);
            pgdb.query("SELECT * FROM information_schema.tables;")
                .then(_ => done())
                .catch(done);
        });
    });   
}