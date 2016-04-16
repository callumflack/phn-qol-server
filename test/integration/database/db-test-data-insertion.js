/**
 * Database test data population tests
 * 
 * Populates the database with suitable test data so that further testing can
 * take place. This also tests the validity of the test-data SQL script.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import pg from 'pg-promise';
import chai from 'chai';
import fs from 'fs';

const TEST_DATA_SQL_FILE = 
    './docs/database/scripts/test-data.sql';

const dbConn = {
    host: process.env.DB_HOSTNAME,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL==="true" || false
};


let projectDir = path.join(__dirname, '../../../');
let assert = chai.assert;

/**
 * Database creation functions
 */
module.exports = function() { 
       
    it('Database test data population', function(done) {
        // We're going to create a temporary schema and inject some data
        // into it.
        this.timeout(3e5);
        var circleBuildNum = process.env.CIRCLE_BUILD_NUM || false,
            schemaName = process.env.DB_TESTING_SCHEMA,
            dbPopulationFile;

        fs.readFile(
            path.join(projectDir, TEST_DATA_SQL_FILE),
            'utf-8',
            createDb
        );
    
        function createDb(err, dbCreateSql) {
            if (err) return done(err);
            var dbCreateSql = dbCreateSql.replace(/ephemeral/g, schemaName);
            let pgdb = pg()(dbConn);
            pgdb
                .query(dbCreateSql)
                .then(_ => done())
                .catch(done);
        }
    });    
}