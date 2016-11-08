'use strict';

var app = angular.module('DisignStudio', ['cloudinary','ui.router','ngSanitize', 'pascalprecht.translate'])

app.filter("trustUrl", ['$sce', function($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}])

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, CloudinaryProvider) {

  $httpProvider.defaults.useXDomain = true;

  CloudinaryProvider.configure({
    cloud_name: 'disignstudio',
    api_key: '671623578364648'
  });

  var lang;
  for (lang in appTranslations) {
    $translateProvider.translations(lang, appTranslations[lang]);
  }
  $translateProvider.preferredLanguage('he');

  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('project', {
      url: '/',
      templateUrl: '/partials/project',
      controller: 'ProjectCtrl'
    })
    .state('designs', {
      url: '/designs',
      params: {
        projId: null,
        aptId: null
      },
      templateUrl: "/partials/designs",
      controller: 'DesignCtrl'
    })
})

.run(function($rootScope, $window) {

  $rootScope.isDebugMode = false;
  $rootScope.domain = "project-services.herokuapp.com";

  $rootScope.$on('$routeChangeSuccess', function() {

    if (!$rootScope.locationsHistory)
      $rootScope.locationsHistory = [];

    $rootScope.locationsHistory.push($location.path());
    $rootScope.locationsHistory.slice(3);
  });
})

app.controller('MainController', function($scope) {

  $scope.registerEvent = function(event, properties) {

    if (properties == null) {
      properties = {};
    }

    mixpanel.track(event, properties);
  }
});
