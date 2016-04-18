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

router
    .get(
        '/',
        /**
         * Returns the data stored in the JWT for the requestion device.
         * @unimplmented
         */
        (req, res, next) => {
            res.json({ a: "Please authenticate." });
        }
    ).post(
        '/',
        /**
         * Device registration.
         * 
         * Accepts device information in order to register it in the database.
         */
        (req, res, next) => {
            res.json({ a: "Thank you for your submission." });
        }
    ).delete(
        '/',
        /**
         * Device registration.
         * 
         * Accepts device information in order to register it in the database.
         */
        (req, res, next) => {
            res.json({ a: "Thank you for your submission." });
        }
    );


module.exports = router;