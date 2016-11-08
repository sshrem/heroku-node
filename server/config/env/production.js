'use strict';

module.exports = {
    env: 'production',
    port: process.env.PORT || 8080,
    loadProjectRequestUrl: 'http://project-services.herokuapp.com/api/project',
    loadDesignsRequestUrl: 'http://project-services.herokuapp.com/api/designs'
};
