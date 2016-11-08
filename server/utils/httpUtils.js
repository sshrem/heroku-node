'use strict';

var
    RSVP = require('rsvp'),
    request = require('superagent');

exports.submitGetRequest = function (requestUrl,query) {
    return new RSVP.Promise(function (resolve, reject) {
        request
            .get(requestUrl)
            .query(query)
            .end(function (err, res) {
                if (err) {
                    return reject(err);
                }

                if (res && res.ok)
                    resolve(res.body);
                else
                    resolve([]);
            });
    });
}

exports.submitPostRequest = function (requestUrl, data) {
    return new RSVP.Promise(function (resolve, reject) {
        request
            .post(requestUrl)
            .send(data)
            .end(function (err, res) {
                if (err) {
                    return reject(err);
                }

                if (res && res.ok)
                    resolve(res.body);
                else
                    resolve([]);
            });
    });
}
