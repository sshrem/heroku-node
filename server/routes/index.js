'use strict';

var index = require('../service/index');
var content = require('../service/content');

module.exports = function (app, config) {
    app.get('/api/project', content.loadProject);
    app.get('/api/designs', content.loadDesigns);
    app.get('/api/config', index.config);
    app.get('/projects', index.projects);
    app.get('/stats', index.stats);
    app.get('/', index.index);
    app.get('/index', index.index);
    app.get('/partials/*', index.partials);
    app.get('/templates/*', index.templates);

};
