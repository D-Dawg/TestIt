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
    const bcrypt = require('bcrypt-nodejs');
    const config = require('./config');

    let genSalt = () => {
        return new Promise(resolve => {
            bcrypt.genSalt(config.BCRYPT_ROUNDS, (e, data) => resolve(data));
        });
    };


    let hash = (string, salt) => {
        return new Promise(resolve => {
            bcrypt.hash(string, salt, null, (e, data) => resolve(data));
        });
    };


    let compare = (string, hash) => {
        return new Promise(resolve => {
            bcrypt.compare(string, hash, (e, data) => resolve(data));
        });
    };

    module.exports.encrypt = Promise.coroutine(function*(string) {
        let salt = yield genSalt();
        return yield hash(string, salt);
    });

    module.exports.matches = Promise.coroutine(function*(string, hash) {
        return yield compare(string, hash);
    });

    module.exports.genPassword = () => {
        return Math.random().toString(36).slice(2).substr(0, 8).toUpperCase();
    };
})();
