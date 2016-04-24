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
var validator = require('validator');
var Provider = require('./provider');

/**
 * @typedef {object} DeviceInfo
 * @property {string} providerCode  The provider code which will be matched to
 *                                  an entry in the database.
 * @property {string} ipAddress An IPv4 or IPv6 address for the client.
 * @property {string} userAgent The user-agent string for the client.
 */
/**
 * @typedef {object} ValidationError
 * @property {string} input The input name being validated.
 * @property {string} error The error raised by the validation.
 */
var DeviceModel = {
    /**
     * Provides validation of input from the client to ensure the device being
     * registered adheres to the expectation.
     * @param {DeviceInfo} deviceInfo   Details provided by the client during a
     *                                  registration request.
     * @return  {Promise.ValidationError[]} Rejects the with an array of errors
     *                                      or resolved to a sanitised version
     *                                      of the input data.
     */
    validate: function(deviceInfo) {
        var errors = [],
            providerCode = deviceInfo.providerCode,
            ipAddress = deviceInfo.ipAddress,
            userAgent = deviceInfo.userAgent;

        // Check the IP Address
        if ( ! validator.isIP(ipAddress))
            errors.push({
                input: "ipAddress",
                code: "not_valid",
                error: "Not a valid IP address"
            });
            
        // Check the User agent
        if (userAgent === undefined || userAgent.length === 0)
            userAgent = "unknown";

        // Check the provider code (Promise)
        return Provider
            .getFromCode(providerCode)
            .then(returnValidation);
        
        function returnValidation(provider) {
            return new Promise(function(resolve, reject) {
                if (provider === undefined)
                    errors.push({
                        input: "providerCode",
                        code: "not_found",
                        error: "No provider found"
                    });

                if (errors.length === 0) {
                    resolve({
                        providerCode: provider,
                        ipAddress: ipAddress,
                        userAgent: userAgent
                    });
                    return;
                }
                
                reject(errors);
            });
        }
    },
    register: function(deviceInfo) {
        
    }
};

module.exports = DeviceModel;