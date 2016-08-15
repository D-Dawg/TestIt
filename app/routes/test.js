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
    const Test = require('../models/Test');
    const AccessToken = require('../models/AccessToken');
    const crypto = require('../crypto');
    const logger = require('proxey-ilogger')('Route:Test');
    const template = require('../enum/template');
    const mailer = require('../mailer');
    const permission = require('../enum/permission');
    const requiresPermission = require('./middleware/requires-permission');
    const Application = require('../models/Application');
    const _ = require('underscore');
    const ITEM_STATUS = require('../enum/item-status');
    let router = require('express').Router();

    router.get('/assignedToMe', Promise.coroutine(function*(req, res) {
        if (!req.query.status) {
            res.status(400).send('query parameter \'status\' missing');
            return -1;
        }
        let tests = yield Test.find({assignee: req.user.user, status: req.query.status});
        res.send(tests);
    }));

    router.get('/all', requiresPermission(permission.VIEW_TESTS), Promise.coroutine(function*(req, res) {
        if (!req.query.status) {
            res.status(400).send('query parameter \'status\' missing');
            return -1;
        }
        let tests = yield Test.find({status: req.query.status}).sort('-status');
        res.send(tests);
    }));

    router.get('/:id', Promise.coroutine(function*(req, res) {
        let test = yield Test.findById(req.params.id);
        if(!test) {
            res.status(404).send('test not found');
            return -1;
        }
        if(test.assignee === req.user.user || (req.user.permissions.indexOf(permission.VIEW_TESTS) > -1)) {
            res.send(test);
        } else {
            res.sendStatus(400);
        }
    }));

    router.post('/assign', requiresPermission(permission.ASSIGN_TEST), Promise.coroutine(function* (req, res) {
        if (typeof req.body === 'object' && typeof req.body._id === 'string' && typeof req.body.assignee === 'string') {
            let test = yield Test.findById(req.body._id);
            if (test !== null) {
                test.assignee = req.body.assignee;
                res.send(yield test.save());
            } else {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(400);
        }
    }));

    router.post('/', Promise.coroutine(function*(req, res) {
        if (typeof req.body === 'object') {
            let test = yield Test.findById(req.body._id);
            if(test.assignee === req.user.user) {
                delete req.body._id;
                delete req.body.__v;
                delete req.body.assignee;
                req.body.lastModified = Date.now();
                test.set(req.body);
                res.send(yield test.save());
            } else {
                res.status(400).send('you can only change tests that are assigned to yourself');
            }
        } else {
            res.sendStatus(400);
        }
    }));

    router.post('/fromApplication', requiresPermission(permission.CREATE_TEST), Promise.coroutine(function*(req, res) {
        if (typeof req.body === 'object' && typeof req.body._id === 'string' && typeof req.body.build === 'string' && typeof req.body.metaData === 'object') {
            let application = yield Application.findById(req.body._id);
            if (!application) {
                res.status(500).send('Application not found');
                return -1;
            }
            let build;
            _.each(application.builds, _build => {
                if (_build.name === req.body.build) {
                    build = _build;
                }
            });
            if (!build) {
                res.status(500).send('Build not found');
                return -1;
            }
            let _test = {};
            _.each(application.features, feature => {
                if (build.features[feature.name.trim()]) {
                    let _section = null;
                    _.each(feature.items.split('\n'), row => {
                        row = row.trim();
                        if (row.indexOf('-') === 0) {
                            _section = row.substring(1);
                        } else {
                            if (row.length > 0) {
                                _test[_section] = _test[_section] || [];
                                _test[_section].push(row);
                            }
                        }
                    });
                }
            });

            let assignee;
            if(req.user.permissions.indexOf(permission.ASSIGN_TEST) > -1) {
                assignee = req.body.assignee || req.user.user;
            } else {
                assignee = req.user.user;
            }

            let metaData = req.body.metaData;
            metaData.application = application.name + ': ' + build.name;

            let test = {
                metaData: metaData,
                assignee: assignee,
                sections: [],
                comments: [],
                relatedIssues: [],
                lastModified: Date.now()
            };

            _.each(_test, (val, key) => {
                let section = {
                    name: key,
                    items: []
                };

                _.each(val, item => {
                    section.items.push({
                        text: item,
                        comment: '',
                        status: ITEM_STATUS.UNTESTED
                    });
                });

                test.sections.push(section);
            });


            let testEntity = new Test(test);
            yield testEntity.save();
            res.send({_id: testEntity._id});
        } else {
            res.sendStatus(400);
        }
    }));


    module.exports = router;
})();
