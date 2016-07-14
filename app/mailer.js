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
    const nodemailer = require('nodemailer');
    const logger = require('proxey-ilogger')('Mailer');
    const Promise = require('bluebird');
    const fs = Promise.promisifyAll(require('fs'));
    const handlebars = require('handlebars');
    const path = require('path');
    const transporter = nodemailer.createTransport({
        pool: true,
        host: process.env.TESTIT_MAIL_HOST,
        auth: {
            user: process.env.TESTIT_MAIL_USER,
            pass: process.env.TESTIT_MAIL_PASSWORD
        }
    });

    module.exports.send = (to, subject, html) => {
        var mailOptions = {
            from: process.env.TESTIT_MAIL_SENDER,
            to: to,
            subject: subject,
            html: html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error('failed to send message with subject ' + subject + ' to ' + to + ': ' + JSON.stringify(error));
            } else {
                logger.info('message sent ' + JSON.stringify(info));
            }
        });
    };

    module.exports.sendWithTemplate = Promise.coroutine(function*(to, subject, template, context) {
        let hbsTemplate = yield this.loadTemplate(template);
        let html = hbsTemplate(context);
        this.send(to, subject, html);
    });

    module.exports.loadTemplate = Promise.coroutine(function*(template) {
        let buff = yield fs.readFileAsync(path.join(__dirname, 'templates', template));
        return handlebars.compile(buff.toString());
    });


})();
