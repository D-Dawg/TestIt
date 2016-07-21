//MIT License

//Copyright (c) 2016 David Oberhofer

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the 'Software'), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
(function () {
    'use strict';
    const Promise = require('bluebird');
    const User = require('../models/User');
    const AccessToken = require('../models/AccessToken');
    const crypto = require('../crypto');
    const logger = require('proxey-ilogger')('Personal');
    const template = require('../enum/template');
    const mailer = require('../mailer');
    const permission = require('../enum/permission');
    let router = require('express').Router();


    router.get('/session', function(req, res) {
        res.send({
            me: req.user,
            permissions: Object.keys(permission)
        });
    });


    router.post('/changePassword', Promise.coroutine(function*(req, res) {
        if(typeof req.body === "object" && typeof req.body.oldPassword === "string" && typeof req.body.newPassword1 === "string") {
            let user = yield User.findOne({user: req.user.user});
            if(user !== null) {
                if((yield crypto.matches(req.body.oldPassword, user.password)) === true) {
                    user.password = yield crypto.encrypt(req.body.newPassword1);
                    yield user.save();
                    res.send({success: true});
                } else {
                    res.send({success: false});
                }
            } else {
                res.send({success: false});
            }
        } else {
            res.send({success: false});
        }
    }));

    module.exports = router;
})();
