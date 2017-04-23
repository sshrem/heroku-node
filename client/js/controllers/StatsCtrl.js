/**
 * Created by shrem on 4/18/17.
 */
'use strict';
angular.module('DisignStudio')
  .controller('StatsCtrl', function ($rootScope, Cloudinary, $scope, $state, $http, debugData) {
    var visitStatRequestUrl = 'http://' + $rootScope.domain + '/api/stats/projectStats';
    $scope.projectCode = 3;

    if (projectIdParam != null && projectIdParam.length > 0) {
      $scope.projectCode = projectIdParam;
    }

    $scope.chartConfig1 = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Visits'
      },
      xAxis: {
        categories: ['Total', 'Users', 'Entrepreneur Users']
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Visits',
        data: [0, 0, 0]
      }]
    };

    $scope.chartConfig2 = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Video Views'
      },
      xAxis: {
        categories: ['Total', 'Users', 'Entrepreneur Users']
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Video Views',
        data: [0, 0, 0]
      }]
    };

    $scope.chartConfig3 = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Facebook Shares'
      },
      xAxis: {
        categories: ['Total', 'Users', 'Entrepreneur Users']
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Facebook Shares',
        data: [0, 0, 0]
      }]
    };

    function updateCharts(data) {
      var visit = data.visitStats;
      var videoView = data.videoViewStats;
      var facebookShare = data.facebookShareStats;

      var visitsData = [visit.count, visit.userCount, visit.entrepreneurUserCount];
      var videoViewData = [videoView.count, videoView.userCount, videoView.entrepreneurUserCount];
      var facebookShareData = [facebookShare.count, facebookShare.userCount, facebookShare.entrepreneurUserCount];
      var maxCount = Math.max(visit.count, videoView.count, facebookShare.count);

      $scope.chartConfig1.series = [{
        name: 'Visits',
        data: visitsData
      }];
      $scope.chartConfig1.yAxis.max = maxCount;

      $scope.chartConfig2.series = [{
        name: 'Video View',
        data: videoViewData
      }];
      $scope.chartConfig2.yAxis.max = maxCount;

      $scope.chartConfig3.series = [{
        name: 'Facebook Share',
        data: facebookShareData
      }];
      $scope.chartConfig3.yAxis.max = maxCount;

    }

    function init() {
      if ($rootScope.isDebugMode) {
        updateCharts(debugData.debugData.stats);
      } else {
        $http.get(visitStatRequestUrl, {
          params: {
            id: $scope.projectCode
          }
        }).success(function (res) {
          if (res.data) {
            var data = res.data;
            updateCharts(data);
          }
        }).error(function (e) {
        });
      }
    }


    init();


  })

