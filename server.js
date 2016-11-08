'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'prod';

var
    config = require('./server/config/config'),
    express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

// Express Configuration
require('./server/config/express')(app, config);

// Bootstrap routes
var
    routesPath = config.root + '/server/routes',
    files = fs.readdirSync(routesPath);

files = _.sortBy(files, function (file) {
    return file === 'index.js' ? 1 : 0;
});

files.forEach(function (file) {
    var filePath = path.join(routesPath, file);
    if (~file.indexOf('.js')) require(filePath)(app, config);
});

app.listen(config.port, function () {
    console.log('DisignStudio server listening on', config.port, 'Env:', config.env);
});
