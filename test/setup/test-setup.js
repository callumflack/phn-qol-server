/**
 * Test scheduler - Test setup
 * 
 * Tasks that take place before unit and integration testing can take place.
 * Includes methods to establish a temporary data set.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';

module.exports = function() {
    describe('Database scripts', () => {
        require(path.join(__dirname, './database/db-creation.js'))();
        require(path.join(__dirname, './database/db-test-data-insertion.js'))();
    });
}
