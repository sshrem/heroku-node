'use strict';

angular.module('DisignStudio')
    .directive('menuBar', function () {
        return {
            restrict: 'E',
            templateUrl: '/templates/navbar',
            controller: 'NavCtrl'
        };
    });
