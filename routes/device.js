/**
 * Device route
 * 
 * This Express.js router manages device registration for the PHN QoL Survey.
 * Methods GET, POST and DELETE are used to manage devices, identified and
 * authenticated using JWT tokens.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

var express = require('express');
var router = express.Router();
var Device = require('../models/device');

router
    .get(
        '/',
        /**
         * Returns the data stored in the JWT for the requestion device.
         * @unimplmented
         */
        (req, res, next) => {
            res.json({ error: "Operation not supported" });
        }
    ).post(
        '/',
        /**
         * Device registration.
         * 
         * Accepts device information in order to register it in the database.
         * The values supplied are validated, and if valid then the device is
         * issued a JWT token which will authorise submissions in future.
         */
        (req, res, next) => {
            var regData = {
                providerCode: req.body.providerCode,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            };
            Device
                .validate(regData)
                .then(Device.register)
                .then(Device.issueToken)
                .then(token => res.json({ token: token }))
                .catch(err => {
                    res.status(400);
                    res.json({errors: err });
                    return;
                });
        }
    ).delete(
        '/',
        /**
         * Device registration.
         * 
         * Accepts device information in order to register it in the database.
         */
        (req, res, next) => {
            res.json({ error: "Operation not supported" });
        }
    );


module.exports = router;