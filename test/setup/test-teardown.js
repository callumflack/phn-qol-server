/**
 * Test scheduler - Test setup
 * 
 * Removes testing artefacts.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';

module.exports = function() {
    describe('Database teardown', () => {
        require(path.join(__dirname, './database/db-deletion.js'))();
    });
}