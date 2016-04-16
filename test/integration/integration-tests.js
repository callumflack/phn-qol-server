/**
 * Test scheduler - Integration tests
 * 
 * Manages the order and inclusion of integration tests for the system, that is,
 * the interoperation of subsystems.
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
    describe('Express response `/`', require(path.join(__dirname, './routes/home.js')));
}