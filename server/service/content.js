'use strict';

var
    httpUtils = require("../utils/httpUtils"),
    config = require('../config/config');

exports.loadProject = function (req, res) {

    loadProjectData(req.query.code, function (data) {

        var response = {};
        response.project = {
            id: data.data.project.id,
            code: data.data.project.code,
            logo: data.data.project.logo
        }

        response.apartments = [];
        for (var index = 0; index < data.data.apartmentTemplates.length; index++) {
            response.apartments[index] = {
                id: data.data.apartmentTemplates[index].id,
                code: data.data.apartmentTemplates[index].code,
                name: data.data.apartmentTemplates[index].name,
                image: data.data.apartmentTemplates[index].image
            }
        }

        res.json(response);
    }, function (err) {
        console.error(err);
        res.status(500).send(err);
    });
}

exports.loadDesigns = function (req, res) {

    loadProjectData(req.query.code, function (data) {
        var apartmentData = filterApartment(data.data.apartmentTemplates, req.query.aptId);
        console.log("filter done");
        var response = {};
        response.title = apartmentData.title;
        response.designs = [];
        for (var index = 0; index < apartmentData.designs.length; index++) {
            response.designs[index] = {
                id: apartmentData.designs[index].id,
                title: apartmentData.designs[index].title,
                imagingCode: apartmentData.designs[index].imagingCode,
                roomType: apartmentData.designs[index].roomType,
                roomName: apartmentData.designs[index].roomName,
                designerName: apartmentData.designs[index].designerName,
                designerImage: apartmentData.designs[index].designerImage,
            }
        }

        res.json(response);
    }, function (err) {
        console.error(err);
        res.status(500).send(err);
    });
}

function filterApartment(data, aptId) {
    console.log(data);
    for (var index = 0; index < data.length; index++) {
        console.log(data[index]);
        if (data[index].id == aptId) {
            return data[index];
        }
    }

    return null;
}

function loadProjectData(code, successCallback, errorCallback) {
    httpUtils.submitGetRequest(config.loadProjectRequestUrl, {'code': code})
        .then(function (data) {
            successCallback(data);
        }, function (err) {
            errorCallback(err);
        });
}
