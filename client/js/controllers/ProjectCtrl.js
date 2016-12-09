'use strict';

angular.module('DisignStudio')
  .controller('ProjectCtrl', function($rootScope,Cloudinary, $scope, $state, $http, debugData) {

    angular.element(document).ready(function () {
      $('.modal-trigger').leanModal();
      $('ul.tabs').tabs();
      $('.slider').slider({full_width: false});
    });

    $scope.projectCode = 3;
    $scope.project;
    $scope.apartments;
    $scope.selectedApartment;

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/project';

    var buildApartmentsArray = function(){
      $scope.apartments = $scope.project.apartmentTemplateCachedData;
    }

    $scope.openApartmentModal = function(aptTemplate){
      $scope.selectedApartment = aptTemplate;
      $('#AptModal').openModal();
    }

    $scope.openProjectModal = function(){
      $('#projectModal').openModal();
    }

    function init() {
      if ($rootScope.isDebugMode) {
        $scope.project = debugData.debugData.project;
        buildApartmentsArray();
      } else {
        $http.get(initRequestUrl, {
          params: {
            code: $scope.projectCode
          }
        }).success(function(res) {
          if (res.data) {
            $scope.project = res.data;
            buildApartmentsArray();
          }
        }).error(function(e) {
          //
        });
      }

    }

    init();
  })
