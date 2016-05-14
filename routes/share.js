/**
 * Share route
 * 
 * Used to manage requests to share survey score results, sending them via email
 * and SMS. Uses the sharing model to integrate with local mailsending services,
 * and the SMS gateway.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var express = require('express');
var router = express.Router();

var deviceModel = require('../models/device');
var shareModel = require('../models/share');


router
    .post(
        '/',
        (req, res, next) => {
            var auth = req.headers['device-token'],
                deviceTokenPayload,
                submissionId = req.body.submissionId,
                method = req.body.method,
                address = req.body.address.replace(/\s/g, "");;
            
            deviceModel
                .verifyToken(auth)
                .then(validateAddress)
                .then(sendScore)
                .then(sendConfirmation)
                .catch(sendError);
            
            function validateAddress(validatedTokenPayload) {
                deviceTokenPayload = validatedTokenPayload;
                return shareModel.validateAddress(address);
            }
            
            function sendScore(validatedMethod) {
                method = validatedMethod;
                if (method === "email")
                    return shareModel.sendEmail(submissionId, address);
                if (method === "sms")
                    return shareModel.sendSms(submissionId, address);
            }

            function sendConfirmation(address) {
                res.send({ success: address });
            }
            
            function sendError(err) {
                console.error(err);
                if (err.name === "JsonWebTokenError") res.status(401);
                else res.status(400);

                res.json({ errors: err });
            }
        }
    );

module.exports = router;