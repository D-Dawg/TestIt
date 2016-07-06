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
    const logger = require('proxey-ilogger')('Auth');
    const template = require('../enum/template');
    const mailer = require('../mailer');
    const config = require('../config');
    let router = require('express').Router();

    router.post('/login', Promise.coroutine(function*(req, res) {
        logger.info('received login request');
        if (typeof req.body === 'object' && typeof req.body.user === 'string' && typeof req.body.password === 'string') {
            let user = yield User.findOne({user: req.body.user});
            if (user !== null) {
                let success = yield crypto.matches(req.body.password, user.password);
                if (success === true) {
                    let accessToken = new AccessToken({
                        user: req.body.user,
                        accessToken: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
                    });
                    yield accessToken.save();
                    res.send(accessToken);
                    logger.info('login request for user ' + req.body.user + ' was successful');
                } else {
                    logger.warn('login request failed: user incorrect password');
                    res.sendStatus(401);
                }
            } else {
                logger.warn('login request failed: user ' + req.body.user + ' not found');
                res.sendStatus(401);
            }
        } else {
            logger.warn('login request failed: malformed request');
            res.sendStatus(400);
        }
    }));

    router.post('/logout', Promise.coroutine(function*(req, res) {
        logger.info('received logout request');
        if (typeof req.cookies === 'object' && typeof req.cookies.accessToken === 'string') {
            yield AccessToken.remove({accessToken: req.cookies.accessToken});
            logger.info('logout request successful');
            res.sendStatus(200);
        } else {
            logger.warn('logout request failed: cookie missing');
            res.sendStatus(400);
        }
    }));

    router.get('/confirmPasswordResetRequest/:code', Promise.coroutine(function*(req, res) {
        let user = yield User.findOne({passwordResetCode: req.params.code});
        if (user !== null) {
            res.location('/login?passwordResetStatus=SUCCESS');
            let password = crypto.genPassword();
            user.password = yield crypto.encrypt(password);
            user.passwordResetCode = null;
            yield user.save();
            mailer.sendWithTemplate(user.email, 'Your new TestIt password', template.NEW_PASSWORD, {user: user.user, password: password});
        } else {
            res.location('/login?passwordResetStatus=ERROR');
        }
        res.sendStatus(301);
    }));

    router.post('/requestNewPassword', Promise.coroutine(function*(req, res) {
        if (typeof req.body === 'object' && typeof req.body.email === 'string') {
            let user = yield User.findOne({email: req.body.email});
            if (user !== null) {
                let code = Math.random().toString(36).toUpperCase().slice(2);
                user.passwordResetCode = code;
                user.save();
                mailer.sendWithTemplate(user.email, 'New password requested', template.NEW_PASSWORD_REQUEST, {url: `${config.BASE_URL}/auth/confirmPasswordResetRequest/${code}`});
                res.end();
            } else {
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(401);
        }
    }));

    module.exports = router;
})();
