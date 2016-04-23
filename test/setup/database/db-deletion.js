/**
 * Database deletion tests
 * 
 * Designed to drop any schemas that have been made during the testing process
 * once the test suite has completed its population. 
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import pg from 'pg-promise';
import chai from 'chai';
import fs from 'fs';

const DB_DELETION_SQL_FILE = 
    './docs/database/scripts/delete-testing-db.sql';

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

    it('Database deletion executes', function(done) {
        // We're going to create a temporary schema and inject some data
        // into it.
        this.timeout(3e5);
        var circleBuildNum = process.env.CIRCLE_BUILD_NUM || false,
            exportedDbTestSchemaName = process.env.DB_SCHEMA,
            schemaName,
            dbCreateFile;
            
        schemaName = exportedDbTestSchemaName || ('testing_' + circleBuildNum);

        fs.readFile(
            path.join(projectDir, DB_DELETION_SQL_FILE),
            'utf-8',
            deleteDb
        );
    
        function deleteDb(err, dbDeleteSql) {
            if (err) return done(err);
            
            // We're using a temporary schema, so let's change the SQL script.
            var dbDeleteSql = dbDeleteSql.replace(/ephemeral/g, schemaName);
            
            let pgdb = pg()(dbConn);
            
            pgdb
                .query(dbDeleteSql)
                .then(_ => done())
                .catch(done);
        }
    });
        
    
}