'use strict';

var index = require('../service/index');
var content = require('../service/content');

module.exports = function (app, config) {
    app.get('/api/project', content.loadProject);
    app.get('/api/designs', content.loadDesigns);
    app.get('/api/config', index.config);
    app.get('/project', index.project);
    app.get('/partials/*', index.partials);
    app.get('/templates/*', index.templates);
};
