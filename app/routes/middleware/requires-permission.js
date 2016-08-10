//MIT License

//Copyright (c) 2016 David Oberhofer

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
(function () {
    'use strict';
    const Promise = require('bluebird');
    const AccessToken = require('../../models/AccessToken');
    const userFromRequest = require('./user-from-request');
    const User = require('../../models/User');

    module.exports = permissions => {
        if(typeof permissions === "string") {
            permissions = [permissions];
        }
        return Promise.coroutine(function*(req, res, next) {
            let user = yield userFromRequest(req);
            if(user !== null) {
                for(let i = 0; i < permissions.length; i++) {
                    if(user.permissions.indexOf(permissions[i]) === -1) {
                        res.status(401).send({error:`permission ${permissions[i]} required`});
                        return;
                    }
                }
                req.user = user;
                next();
            } else {
                res.sendStatus(401);
            }
        });
    };

})();
