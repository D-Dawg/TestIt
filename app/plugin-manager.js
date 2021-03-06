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
(function() {
    'use strict';
    const Promise = require('bluebird');
    const fs = Promise.promisifyAll(require('fs-extra'));
    const path = require('path');
    const logger = require('proxey-ilogger')('PluginManager');
    const _ = require('underscore');

    const PLUGIN_DIR = path.join(__dirname, '..', 'plugins');

    let _loadedPlugins = {};

    let _loadPlugins = Promise.coroutine(function*() {
        let plugins = yield fs.readdirAsync(PLUGIN_DIR);
        _.each(plugins, plugin => {
            logger.info(`loading plugin '${plugin}'`);
            _loadedPlugins[plugin] = require(path.join(PLUGIN_DIR, plugin, 'index.js'));
        });
        logger.info(`loaded ${Object.keys(_loadedPlugins).length} plugin(s)`);
    });

    _loadPlugins();
})();
