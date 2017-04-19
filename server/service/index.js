'use strict';

var
    path = require('path'),
    logger = require('winston'),
    fs = require('fs'),
    config = require('../config/config');

exports.partials = function (req, res) {
    var stripped = req.url.split('/')[2];
    var requestedView = path.join('./partials', stripped);

    res.render(requestedView, function (err, html) {
        if (err)
            logger.error(err);
        else
            res.send(html);
    });
};

exports.templates = function (req, res) {
    var stripped = req.url.split('/')[2];
    var requestedView = path.join('./templates', stripped);

    res.render(requestedView, function (err, html) {
        if (err)
            logger.error(err);
        else
            res.send(html);
    });
};

exports.index = function (req, res) {
    res.render('index', {
        env: config.env
    }, function (err, html) {
        if (err)
            console.log(err);
        else
            res.send(html);
    });
};

exports.projects = function (req, res) {
    res.render('projects', {
        env: config.env
    }, function (err, html) {
        if (err)
            console.log(err);
        else
            res.send(html);
    });
};

exports.stats = function (req, res) {
    res.render('stats', {
        env: config.env
    }, function (err, html) {
        if (err)
            console.log(err);
        else
            res.send(html);
    });
};

exports.config = function (req, res) {
    res.json(config);
};
