'use strict';

angular.module('DisignStudio')
  .controller('ProjectCtrl', function ($rootScope, Cloudinary, $scope, $state, $http, debugData, $stateParams, $cookieStore) {

    angular.element(document).ready(function () {
      $('.modal-trigger').leanModal();
      $('ul.tabs').tabs();
      $('.slider').slider({full_width: false});
    });
    var initRequestUrl = 'http://' + $rootScope.domain + '/api/project';
    $scope.visitStatRequestUrl = 'http://' + $rootScope.domain + '/api/stats/recordVisit';

    $scope.projectCode = 3;
    $scope.project;
    $scope.apartments;
    $scope.selectedApartment;

    if ($stateParams.projId!=null && $stateParams.projId.length>0){
      $scope.projectCode = $stateParams.projId;
    }

    if ($stateParams.entrUserId!=null && $stateParams.entrUserId.length>0){
      $rootScope.entrepreneurUserId = $stateParams.entrUserId;
    }


    var buildApartmentsArray = function () {
      $scope.apartments = $scope.project.apartmentTemplateCachedData;
    }

    $scope.openApartmentModal = function (aptTemplate) {
      $scope.selectedApartment = aptTemplate;
      $('#AptModal').openModal();
    }

    $scope.openProjectModal = function () {
      $('#projectModal').openModal();
    }

    $scope.getRequestData = function () {
      var uuid = $rootScope.getUuid();
      var data = {
        userId: uuid,
        entrepreneurUserId: $rootScope.entrepreneurUserId,
        projectId: $scope.projectCode,
        page: $state.current.name
      };
      return data;
    }

    $scope.sendVisitStatRequest = function () {
      if ($rootScope.shouldSendStats){
        var data = $scope.getRequestData();
        $http.post($scope.visitStatRequestUrl, data);
      }
    };


    function init() {
      if ($rootScope.isDebugMode) {
        $scope.project = debugData.debugData.project;
        buildApartmentsArray();
      } else {
        $http.get(initRequestUrl, {
          params: {
            code: $scope.projectCode
          }
        }).success(function (res) {
          if (res.data) {
            $scope.project = res.data;
            buildApartmentsArray();
            $scope.sendVisitStatRequest();
          }
        }).error(function (e) {
          //
        });
      }

    }

    init();
  })
