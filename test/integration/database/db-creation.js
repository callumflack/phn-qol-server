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
import chai from 'chai';
import fs from 'fs';

const DB_CREATION_SQL_FILE = 
    './docs/database/scripts/create-testing-db.sql';

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

    it('Database creation executes', function(done) {
        // We're going to create a temporary schema and inject some data
        // into it.
        this.timeout(3e5);
        var circleBuildNum = process.env.CIRCLE_BUILD_NUM || false,
            schemaName = 'testing_',
            randomSchemaName = Math
                .random()
                .toString(36)
                .replace(/[^a-zA-Z]/g, ''),
            dbCreateFile;
            
        schemaName += circleBuildNum || randomSchemaName;
        process.env["DB_TESTING_SCHEMA"] = schemaName;

        fs.readFile(
            path.join(projectDir, DB_CREATION_SQL_FILE),
            'utf-8',
            createDb
        );
    
        function createDb(err, dbCreateSql) {
            if (err) return done(err);
            
            // We're using a temporary schema, so let's change the SQL script.
            var dbCreateSql = dbCreateSql.replace(/ephemeral/g, schemaName);
            
            // While we're at it, let's set the schema once and for all.
            dbCreateSql = dbCreateSql.replace(
                /phn\-qol\-survey/,
                dbConn.database
            );
            
            let pgdb = pg()(dbConn);
            pgdb
                .query(dbCreateSql)
                .then(_ => done())
                .catch(done);
        }
    });
        
    
}