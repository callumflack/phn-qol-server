/**
 * Admin route
 * 
 * Allows an admin user to log in with a predetermined set of credentials (as
 * stored in the environment variables ADMIN_USERNAME and ADMIN_PASSWORD). This
 * router also handles CSV generation from the data set.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var express = require('express');
var router = express.Router();

var adminModel = require('../models/admin');

router
    .get(
        '/download',
        (req, res, next) => {
            var token = req.query.token;
            
            adminModel
                .verifyToken(token)
                .then(adminModel.submissionData)
                .then(deliverCsv)
                .catch(error)
 
            function deliverCsv(data) {
                var json2csv = require('json-2-csv'),
                    timestamp = new Date();

                json2csv.json2csv(
                    data,
                    function(err, csv) {
                        if (err) return error(err);
                        res.set('Content-Type', 'text/csv');
                        res.set(
                            'Content-Disposition', 
                            "attachment;filename=PHN%20QoL%20Survey%20Results%20"
                                + timestamp.getFullYear() + "-"
                                + timestamp.getMonth() + "-"
                                + timestamp.getDate()  + ".csv"   
                        );
                        res.send(csv);
                    }
                );
            }
            function error(err) {
                res.status(400);
                res.json({errors:[err]});
            }
        }
    )
    .post(
        '/login',
        (req, res, next) => {
            var username = req.body.username,
                password = req.body.password;
            
            if (username !== process.env.ADMIN_USERNAME) return denyAccess();
            if (password !== process.env.ADMIN_PASSWORD) return denyAccess();
            
            adminModel
                .issueToken()
                .then(sendToken)
                .catch(error);
            
            function sendToken(tokenString) {
                res.json({adminToken: tokenString});
                return;
            }

            function denyAccess() {
                res.status(403);
                res.json({ errors: [
                    {
                        code: 'invalid_credentials',
                        message: "The admin username/password supplied is incorrect."
                    }
                ]});
            }

            function error(err) {
                res.status(400);
                res.json({errors:[err]});
            }
        }
    );

module.exports = router;