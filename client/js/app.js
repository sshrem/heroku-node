'use strict';

var app = angular.module('DisignStudio', ['cloudinary','ui.router','ngSanitize', 'ngAnimate','pascalprecht.translate', '720kb.socialshare', 'angularUUID2', 'ngCookies', 'highcharts-ng'])

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

  $translateProvider.useSanitizeValueStrategy('escape');
  var lang;
  for (lang in appTranslations) {
    $translateProvider.translations(lang, appTranslations[lang]);
  }
  $translateProvider.preferredLanguage('he');

  $urlRouterProvider.otherwise('/index/')

  $stateProvider
    .state('index', {
        url: '/index/:projId',
        templateUrl: '/partials/project_full',
        controller: 'ProjectCtrl'
    })
    .state('project', {
          url: '/project/:projId/:entrUserId',
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
    });

})

.run(function($rootScope, $window, uuid2, $cookies, $cookieStore) {

  $rootScope.isDebugMode = false;
  $rootScope.shouldSendStats = true;
  // $rootScope.domain = "127.0.0.1:8082";
  $rootScope.domain = "projects.disignstudio.com";

  $rootScope.selected=[];
  $rootScope.facebookAppId = '154124565100474';
  $rootScope.entrepreneurUserId="";
  $rootScope.uuid;

  $rootScope.$on('$routeChangeSuccess', function() {

    if (!$rootScope.locationsHistory)
      $rootScope.locationsHistory = [];

    $rootScope.locationsHistory.push($location.path());
    $rootScope.locationsHistory.slice(3);
  });

  $rootScope.getUuid = function(){
    if ($rootScope.uuid == null) {
      $rootScope.uuid = $cookieStore.get("uuid");
    }

    if ($rootScope.uuid == null) {
      $rootScope.uuid = uuid2.newuuid();
      $cookieStore.put('uuid', $rootScope.uuid);
    }

    return $rootScope.uuid;
  }

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
