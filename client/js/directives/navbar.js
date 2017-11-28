'use strict';

angular.module('DisignStudio')
  .directive('menuBar', function () {
    return {
      restrict: 'E',
      scope: {
        navaprt: '@navaprt'
      },
      templateUrl: '/templates/navbar',
      controller: 'NavCtrl'
    };
  });
