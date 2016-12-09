'use strict';

angular.module('DisignStudio')

    .controller('NavCtrl', function($rootScope,Cloudinary, $scope, $state, $http, debugData) {
        angular.element(document).ready(function () {
            $(".dropdown-button").dropdown();
        });

        $scope.projectCode = 3;
        $scope.navbar;

        var initRequestUrl = 'http://' + $rootScope.domain + '/api/project';

        function init() {
            if ($rootScope.isDebugMode) {
                $scope.navbar = debugData.debugData.navbar;
            } else {
                $http.get(initRequestUrl, {
                    params: {
                        code: $scope.projectCode
                    }
                }).success(function(res) {
                    if (res.data) {
                        $scope.navbar = res.data;
                    }
                }).error(function(e) {
                    //
                });
            }

        }

        init();
    })
