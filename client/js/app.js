'use strict';

var app = angular.module('DisignStudio', ['cloudinary','ui.router','ngSanitize', 'ngAnimate','pascalprecht.translate', '720kb.socialshare'])

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
  $.cloudinary.config({ cloud_name: 'disignstudio', api_key: '671623578364648'})

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
      url: '/designs/:projId/:aptId/:itemFilters',
      templateUrl: "/partials/designs",
      controller: 'DesignCtrl'
    })
    .state('designSuppliers', {
      url: '/designSuppliers/:projId/:aptId',
      templateUrl: "/partials/designSuppliers",
      controller: 'DesignSuppliersCtrl'
    })
})

.run(function($rootScope, $window) {

  $rootScope.isDebugMode = false;
  // $rootScope.domain = "127.0.0.1:8082";
  $rootScope.domain = "project-services.herokuapp.com";

  $rootScope.selected=[];
  $rootScope.facebookAppId = '154124565100474';

  $rootScope.$on('$routeChangeSuccess', function() {

    if (!$rootScope.locationsHistory)
      $rootScope.locationsHistory = [];

    $rootScope.locationsHistory.push($location.path());
    $rootScope.locationsHistory.slice(3);
  });
})

app.controller('MainController', function($scope, $translate) {

  $scope.registerEvent = function(event, properties) {

    if (properties == null) {
      properties = {};
    }

    mixpanel.track(event, properties);
  }

  $scope.changeLanguage = function (key) {
      $translate.use(key);
  };
});
