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
    require('./app/persistence'); //connect mongodb and load promise library
    const crypto = require('./app/crypto');
    const User = require('./app/models/User');
    const Promise = require('bluebird');
    const logger = require('proxey-ilogger')('Install');
    const mailer = require('./app/mailer');
    const config = require('./app/config');
    const permission = require('./app/enum/permission');

    Promise.coroutine(function*() {
        let data = yield User.findOne({user: 'admin'});
        if(data === null) {
            logger.info('admin user doesn\'t exists! creating one');
            let password = crypto.genPassword();
            let user = new User({
                user: 'admin',
                name: 'Administrator',
                email: config.ADMIN_EMAIL,
                password: yield crypto.encrypt(password),
                permissions: Object.keys(permission)
            });
            yield user.save();
            mailer.send(config.ADMIN_EMAIL, 'Admin Account Created', password);
        } else {
            logger.info('admin user already exists');
        }
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    })();
})();
