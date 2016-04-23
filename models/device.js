/**
 * Device Registration model
 * PHN QoL Server
 * 
 * Handles the business logic of device registration into the database,
 * providing validation for devices, updates to registration status, etc.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var validator = require('validator-js');

/**
 * @typedef {object} DeviceInfo
 * @property {string} providerCode  The provider code which will be matched to
 *                                  an entry in the database.
 * @property {string} ipAddress An IPv4 or IPv6 address for the client.
 * @property {string} userAgent The user-agent string for the client.
 */
var DeviceModel = {
    /**
     * Provides validation of input from the client to ensure the device being
     * registered adheres to the expectation.
     * @param {DeviceInfo} deviceInfo   Details provided by the client during a
     *                                  registration request.
     * @return  Returns an arry of error objects if there are errors, otherwise
     *          it returns undefined.
     */
    validate: function(deviceInfo) {
        var errors = [];
        // Check the provider code
    }
};

module.exports = DeviceModel;