angular.module('DisignStudio')
  .filter('designByRoom', function () {
    return function (input, type) {

      if (type == 1) {
        return input;
      }

      var output = [];
      for (var i = 0; i < input.length; i++) {
        if (input[i].roomType == type) {
          output.push(input[i]);
        }
      }

      return output;
    };
  })
  .controller('DesignCtrl', function ($rootScope, $scope, Cloudinary, designByRoomFilter, $window, $http, $stateParams, debugData) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/designs';


    $scope.designsToShow;
    $scope.allDesigns;
    $scope.roomTypeSelected = 1;
    $scope.stam = $stateParams.projId + ' - ' + $stateParams.aptId;

    var filters = [];
    var items = $stateParams.itemFilters.split(',');
    for (var i  in items) {
      var roomItem = items[i].split('_')
      var room = parseInt(roomItem[0]);
      var offer = parseInt(roomItem[1]);
      filters.push({room: room, offer: offer});
    }

    $(document).ready(function () {
      $('.tooltipped').tooltip({delay: 50});
    });

    $scope.playVideo = function (title, imgCode) {
      var imagingUrl = Cloudinary.url(imgCode, {resource_type: 'video', format: 'mp4', crop: 'scale'});
      $window.plugins.streamingMedia.playVideo(imagingUrl);
      $scope.registerEvent("PlayVideo", {
        "design": title,
        "project": $stateParams.projId,
        "apartment": $stateParams.aptId
      });
    }

    $scope.filterDesigns = function (roomType) {
      $scope.roomTypeSelected = roomType;
      $scope.designsToShow = designByRoomFilter($scope.allDesigns.designs, roomType);
      $scope.designsToShow = _.chunk($scope.designsToShow, 3);
      $scope.registerEvent("FilterDesigns", {
        "project": $stateParams.projId,
        "apartment": $stateParams.aptId,
        "room": roomType
      });
    }


    function init() {
      if ($rootScope.isDebugMode) {
        $scope.allDesigns = debugData.debugData.allDesigns;
        $scope.filterDesigns(1);
      } else {
        $http.post(initRequestUrl, {
          atId: $stateParams.aptId,
          projId: $stateParams.projId,
          supplierFilter: {
            supplier: 1
          },
          itemFilters: filters
        }).success(function (res) {
          if (res.data) {
            $scope.allDesigns = res.data;
            $scope.filterDesigns(1);
          }
        }).error(function (e) {
          var a = 1;
        });
      }
    }

    init();
  })
