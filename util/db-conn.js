/**
 * Database connection utility
 * 
 * Exports a ready-to-use pg-promise database object by setting connection
 * params and managing the connection using the singleton pattern.
 *
 * Uses the database defined using environment variables. The modules exported
 * by this method are instantiations of the pg-promise library and a Database
 * object with the connection settings in place.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

var pg = require('pg-promise');

var dbConn = {
    host: process.env.DB_HOSTNAME,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL==="true" || false
};

var pgInitalised = pg();
var pgdb = pgInitalised(dbConn);

module.exports = {
    pg: pgInitalised,
    db: pgdb,
    schema: dbConn.schema
}; 