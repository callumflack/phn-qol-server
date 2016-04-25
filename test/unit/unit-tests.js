/**
 * Test scheduler - Unit tests
 * 
 * Runs the unit tests for models within the Express system. This will need to
 * be run after the test database has been set up.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';

module.exports = function() {
    describe('Provider model', () => {
        require(path.join(__dirname, './models/provider.js'))();
    
    });
    describe('Survey model', () => {
        require(path.join(__dirname, './models/survey.js'))();
    
    });
}