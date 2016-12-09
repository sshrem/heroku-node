angular.module('DisignStudio')
  .controller('DesignSuppliersCtrl', function ($rootScope, $scope, Cloudinary, designByRoomFilter, $window, $http,
                                               $stateParams, debugData, $timeout) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/designsFilters';

    $scope.roomItems;
    $scope.itemFilters = [];
    $scope.allSuppliers;
    $rootScope.selected = [];

    $(document).ready(function () {
      $('.tooltipped').tooltip({delay: 50});
      $('.collapsible').collapsible();
    });

    $timeout(function () {
      $('.collapsible-header').addClass('active');
      $('.collapsible').collapsible();
    }, 1000);

    $scope.getDesignsParams = function () {
      var params = {
        projId: $stateParams.projId,
        aptId: $stateParams.aptId,
        itemFilters: $scope.itemFilters
      };
      return params;
    }

    $scope.getSelectedValue = function (roomId, offeringId) {
      return {room: roomId, offer: offeringId}
    }

    $scope.playVideo = function () {
      $('#video').get[0].start();
    }

    $scope.getIcon = function (roomId) {
      switch (roomId) {
        case 1:
          return "hotel";
        case 2:
          return "weekend";
        case 3:
          return "wc";
        default:
          return "hotel";

      }
    }

    $scope.isChecked = function (index) {
      return index == 0;
    }

    function init() {
      if ($rootScope.isDebugMode) {
        $scope.data = debugData.debugData.designSupplier;
        $scope.allSuppliers = $scope.data.suppliers;
        $scope.roomItems = $scope.data.roomItems;
        for (var room in $scope.roomItems) {
          $rootScope.selected[room] = {
            room: $scope.roomItems[room].roomId,
            offer: $scope.roomItems[room].items[0].offeringId
          };
          $scope.itemFilters[room] = $scope.roomItems[room].roomId + "_" + $scope.roomItems[room].items[0].offeringId;
        }

      } else {
        $http.post(initRequestUrl, {
          atId: $stateParams.aptId,
          projId: $stateParams.projId
        }).success(function (res) {
          if (res.data) {
            $scope.allSuppliers = res.data.suppliers;
            $scope.roomItems = res.data.roomItems;
            for (var room in $scope.roomItems) {
              $rootScope.selected[room] = {
                room: $scope.roomItems[room].roomId,
                offer: $scope.roomItems[room].items[0].offeringId
              };

              $scope.itemFilters[room] = $scope.roomItems[room].roomId + "_" + $scope.roomItems[room].items[0].offeringId;
            }
          }

        }).error(function (e) {
          var a = 1;
        });
      }
    }

    init();
  })
