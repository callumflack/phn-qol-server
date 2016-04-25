/**
 * Device model unit test
 * 
 * Unit tests for the device model.
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
    var token;
    
    it('Validates a device with correct info', function(done) {
        var deviceModel = require(path.join(projectDir, './models/device'));
        var device = {
            provider: {
                id: 2
            },
            ipAddress: '192.168.0.1',
            userAgent: 'Mocha test suite.'
        }
        
        deviceModel
            .register(device)
                .then((deviceInfo) => {
                    assert.equal(deviceInfo, device);
                    done();
                })
                .catch((err) => done(err));
    });
    
    it('Produces a JWT for a given device', function(done) {
        var deviceModel = require(path.join(projectDir, './models/device'));
        var device = {
            provider: {
                id: 2
            },
            ipAddress: '192.168.0.1',
            userAgent: 'Mocha test suite.'
        }
        
        deviceModel
            .register(device)
                .then(deviceModel.issueToken)
                .then((generatedToken) => {
                    token = generatedToken;
                    assert.isString(token);
                    done();
                })
                .catch((err) => done(err));
    });
    
    it('Validates a produced JWT token', function(done) {
        var deviceModel = require(path.join(projectDir, './models/device'));
        
        deviceModel
            .verifyToken(token)
                .then((payload) => {
                    assert.isObject(payload);
                    assert.isObject(payload.provider);
                    assert.isNumber(payload.provider.id);
                    assert.isString(payload.uuid);
                    done();
                });
    });
    
    it('Flags an invalid JWT token', function(done) {
        var deviceModel = require(path.join(projectDir, './models/device'));
        
        deviceModel
            .verifyToken(token + 'abc')
                .catch(
                    (err) => {
                        assert.isObject(err);
                        done();
                    }
                );
    });

}