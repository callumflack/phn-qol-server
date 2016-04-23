/**
 * Provider model unit test
 * 
 * Unit tests for the provider model.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
import path from 'path';
import chai from 'chai';

let projectDir = path.join(__dirname, '../../../');
let assert = chai.assert;

const TEST_PROVIDER_CODE = "ENT102";

module.exports = function() {
    it('Matches a provider by code', function(done) {
        var provider = require(path.join(projectDir, './models/provider'));
        var providerInfoPromise = provider
            .getFromCode(TEST_PROVIDER_CODE)
            .then(checkProvider);
        
        assert.instanceOf(providerInfoPromise, Promise);
        
        function checkProvider(providerObj) {
            assert.isString(providerObj.code);
            assert.equal(providerObj.code, TEST_PROVIDER_CODE);

            assert.isString(providerObj.code);
            assert.isString(providerObj.code);
           
            done();            
        }
    });
    
    it('Returns `undefined` for a non-match', function(done) {
        var provider = require(path.join(projectDir, './models/provider'));
        var providerInfoPromise = provider
            .getFromCode(TEST_PROVIDER_CODE + 'asdfjldf')
            .then(checkProvider);
        
        assert.instanceOf(providerInfoPromise, Promise);
        
        function checkProvider(providerObj) {
            assert.isUndefined(providerObj);           
            done();            
        }
    });
}