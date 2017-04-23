'use strict';

var
    express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    session = require('cookie-session'),
    path = require('path');

module.exports = function (app, config) {

    app.set('views', config.root + '/client/views');
    app.set('view engine', 'jade');
    app.use(compression());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(session({
      secret: 'seshen',
      resave: true,
      saveUninitialized: true
    }));
    app.use(cors({credentials: true, origin: true}));
    app.use(methodOverride());

    if (['production', 'prod', 'stg'].indexOf(config.env) !== -1) {
        app.use(favicon(path.join(config.root, 'client/images', 'favicon.png')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', 'client');
        app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
    }

    if ('dev' === config.env) {
        app.use(favicon(path.join(config.root, 'client/images', 'favicon.png')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', 'client');
        app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
        app.use(errorHandler());
    }
};
