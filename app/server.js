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
(function() {
    'use strict';
    const express = require('express');
    const logger = require('proxey-ilogger')('Webserver');
    const Promise = require('bluebird');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const compression = require('compression');
    const path = require('path');
    const requiresPermission = require('./routes/middleware/requires-permission');
    const requiresLogin = require('./routes/middleware/requires-login');
    const userFromRequest = require('./routes/middleware/user-from-request');
    const permission = require('./enum/permission');
    const ITEM_STATUS = require('./enum/item-status');

    const WEBROOT = path.join(__dirname, '..', 'www');

    const app = express();
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(compression());
    app.use('/', express.static(path.join(WEBROOT)));
    app.use('/auth', require('./routes/auth'));
    app.use('/admin', requiresPermission(permission.ADMINISTRATION), require('./routes/admin'));
    app.use('/personal', requiresLogin(), require('./routes/personal'));
    app.use('/application', requiresLogin(), require('./routes/application'));
    app.use('/test', requiresLogin(), require('./routes/test'));

    app.get('/', Promise.coroutine(function*(req, res) {
        let user = yield userFromRequest(req);
        if(user !== null) {
            res.location('/home');
        } else {
            res.location('/login');
        }
        res.sendStatus(302);
    }));

    app.get('/home', Promise.coroutine(function*(req, res) {
        let user = yield userFromRequest(req);
        if(user !== null) {
            res.sendFile(path.join(WEBROOT, 'home.html'));
        } else {
            res.location('/login');
            res.sendStatus(302);
        }
    }));

    app.get('/login', Promise.coroutine(function*(req, res) {
        let user = yield userFromRequest(req);
        if(user === null) {
            res.sendFile(path.join(WEBROOT, 'login.html'));
        } else {
            res.location('/home');
            res.sendStatus(302);
        }
    }));

    app.get('/enums', (req, res) => {
        res.send({
            ITEM_STATUS: Object.keys(ITEM_STATUS)
        });
    });


    let port = process.env.port || 8080;
    app.listen(port, () => {
        logger.info(`listening on port ${port}`, port);
    });
})();
