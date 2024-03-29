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
 * @typedef {object} Device
 * @property {string} providerCode  The provider code which will be matched to
 *                                  an entry in the database.
 * @property {Provider} provider    A Provider object (see provider.js) to which
 *                                  this device belongs.
 * @property {string} ipAddress An IPv4 or IPv6 address for the client.
 * @property {string} userAgent The user-agent string for the client.
 */

const JWT_KEY = process.env.JWT_KEY;
const SERVER_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

/**
 * @typedef {object} ValidationError
 * @property {string} input The input name being validated.
 * @property {string} error The error raised by the validation.
 */
var DeviceModel = {
    /**
     * Provides validation of input from the client to ensure the device being
     * registered adheres to the expectation.
     * @param {Device} deviceInfo   Details provided by the client during a
     *                              registration request. This will typically
     *                              exclude the `provider` property.
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
                    // Send a fully-fledged `Device` object.
                    resolve({
                        providerCode: provider.code,
                        provider: provider,
                        ipAddress: ipAddress,
                        userAgent: userAgent
                    });
                    return;
                }
                
                reject(errors);
            });
        }
    },
    /**
     * Registers a device in the database, issuing a UUID with which to identify
     * the device.
     * @param {Device} device   A Device object will all properties defined.
     */
    register: function(device) {
        var uuid = require('node-uuid');
        var dbConn = require('../util/db-conn'),
            db = dbConn.db,
            deviceUuid = uuid.v4();

        device.uuid = deviceUuid;

        return db.query(
            `
                INSERT INTO schema_name.device
                    (guid, registered, provider_id, ip_address, user_agent, status)
                VALUES
                    ($1, NOW(), $2, $3, $4, 'ACTIVE')
            `.replace(/schema_name/g, dbConn.schema),
            [ deviceUuid, device.provider.id, device.ipAddress, device.userAgent ]
        )
        .then(confirmRegistration)
        .catch(err => console.log(err));
        
        function confirmRegistration(result) {
            return new Promise(function (resolve, reject) {
                resolve(device);
            });
        }
    },
    /**
     * Generates a JWT token for the device, which may be used to authenticate
     * survey submissions.
     * @param {Device} device   The device information, along with the UUID
     *                          stored in the database.
     * @return {Promise.string} Returns a JSON Web Token which may be stored by
     *                          the client for survey authentication.
     */
    issueToken: function(device) {
        var jwt = require('jsonwebtoken'),
            tokenData = {
                provider: {
                    id: device.provider.id
                }
            },
            tokenOptions = {
                issuer: SERVER_URL,
                audience: CLIENT_URL,
                expiresIn: 1000*60*60*24*356*2, // 2 years
                notBefore: 0,
                jwtid: device.uuid
            }
        
        return new Promise(function(resolve, reject) {
            jwt.sign(
                tokenData,
                JWT_KEY,
                tokenOptions,
                function(token) { resolve(token); return; }
            );
        });
    },
    /**
     * Takes a JWT token (encoded), decodes and verifies it for authenticity.
     * @param {string} tokenString  The encoded JWT token.
     * @return {Promise.boolean}    Returns a boolean TRUE or FALSE based on the
     *                              verification against the JWT key.
     */
    verifyToken: function(tokenString) {
        return new Promise(function (resolve, reject) {
            var jwt = require('jsonwebtoken');
            jwt.verify(
                tokenString,
                JWT_KEY,
                {
                    issuer: SERVER_URL,
                    audience: CLIENT_URL
                },
                returnVerification
            );

            function returnVerification(err, result) {
                if (err) { reject(err); return; }
                result.uuid = result.jti;
                resolve(result); return;
            }
        });
    }
};

module.exports = DeviceModel;