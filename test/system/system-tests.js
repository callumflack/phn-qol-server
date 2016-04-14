/**
 * Test scheduler - System tests
 * 
 * Manages the platform requirements for unit and integration testing. 
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';

module.exports = function() {
    describe(
        'Database environment variables',
        require(path.join(__dirname, './database/db-env-vars'))
    );
    describe(
        'Database connectivity',
        require(path.join(__dirname, './database/db-connectivity'))
    );
}