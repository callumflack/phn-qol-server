/**
 * Provider model
 * PHN QoL Server
 * 
 * Manages provider information from the database.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

/**
 * @typedef Provider
 * @property {string} code  The provider code as referenced by PHN.
 * @property {string} region    The geographic region in which this proivder is
 *                              located.
 * @property {string} location  The venue name or suburb.
 */
var ProviderModel = {
    /**
     * Retrieves provider information from the database.
     * @param {string} providerCode The provider code, as listed in the provider
     *                              table within the database.
     * @return {Promise.Provider}   Returns a Promise that resolves a Provider
     *                              object if a match is found, undefined if no
     *                              match is found.
     */
    getFromCode: function(providerCode) {
        var dbConn = require('../util/db-conn'),
            db = dbConn.db;
        
        return db.one(
            `
                SELECT
                    schema_name.provider.id,
                    schema_name.provider.code,
                    schema_name.provider.region,
                    schema_name.provider.location
                FROM schema_name.provider
                WHERE LOWER(schema_name.provider.code) = LOWER($1)
            `.replace(/schema_name/g, dbConn.schema),
            [providerCode]
        )
        .then(resolveProvider)
        .catch(providerError);
        
        function resolveProvider(result) {
            return new Promise(
                function(resolve, reject) {
                    return resolve(result);
                }
            );
        }
        
        function providerError(err) {
            return new Promise((resolve, reject) => {
                if (err.code === dbConn.pg.errors.queryResultErrorCode.noData) {
                    resolve(undefined);
                    return;
                }
                
                reject(err);
            });
        }
    }
};

module.exports = ProviderModel;