angular.module('DisignStudio')
  .controller('DesignSuppliersCtrl', function ($rootScope, $scope, Cloudinary, designByRoomFilter, $window, $http,
                                               $stateParams, debugData, $timeout, $location, $anchorScroll) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/designsFilters';

    var cloudinaryPath= "projects/shikunbinuidpchk/";
    var cloudinaryPath2= "video:projects:shikunbinuidpchk:";

    $scope.roomItems;
    $scope.allSuppliers;
    $scope.showVideoDiv = false;
    $scope.videoList=[];
    $location.hash('apartment-nav');
    $anchorScroll();


      $(document).ready(function () {
      $('.tooltipped').tooltip({delay: 50});
      $('.collapsible').collapsible();
    });

    $timeout(function () {
      $('.collapsible-header').addClass('active');
      $('.collapsible').collapsible();
    }, 1000);

    $scope.getVideoValue = function (supplierId, roomId, offeringId){
      var path = cloudinaryPath2 +  $stateParams.aptId + ":";
      if (roomId == 2) {
        path = cloudinaryPath +  $stateParams.aptId + "/" ;
      }
      path = path + supplierId + "_" + roomId + "_"  + offeringId;

      return path;

    }

    $scope.changeDesignVideo = function(){
      var isPaused = $('#video2').get(0).paused;
      if (!isPaused){
        $scope.playDesignVideo();
      }

    };
    $scope.playDesignVideo = function () {
      $scope.showVideoDiv=true;
      var mp4Url = Cloudinary.url($scope.videoList[2], {resource_type: 'video', format: 'mp4',
        transformation: [
          {overlay: $scope.videoList[1], flags: "splice"},
          {overlay: $scope.videoList[3], flags: "splice"},
        ]});

      var webmUrl = Cloudinary.url($scope.videoList[2], {resource_type: 'video', format: 'webm',
        transformation: [
          {overlay: $scope.videoList[1], flags: "splice"},
          {overlay: $scope.videoList[3], flags: "splice"},
        ]});

      var oggUrl = Cloudinary.url($scope.videoList[2], {resource_type: 'video', format: 'ogg',
        transformation: [
          {overlay: $scope.videoList[1], flags: "splice"},
          {overlay: $scope.videoList[3], flags: "splice"},
        ]});

      $('#video2 source[type="video/mp4"]' ).get(0).setAttribute("src", mp4Url);
      $('#video2 source[type="video/ogg"]' ).get(0).setAttribute("src", oggUrl);
      $('#video2 source[type="video/webm"]' ).get(0).setAttribute("src", webmUrl);
      var currentTime = $('#video2').get(0).currentTime;
      var duration = $('#video2').get(0).duration;

      $('#video2').get(0).load();
      if (currentTime>0 && currentTime<duration){
        $('#video2').get(0).currentTime = currentTime;
      }
      $('#video2').get(0).play();
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
          $scope.videoList[$scope.roomItems[room].roomId] = $scope.getVideoValue($scope.roomItems[room].items[0].supplierId, $scope.roomItems[room].roomId, $scope.roomItems[room].items[0].offeringId);
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
              $scope.videoList[$scope.roomItems[room].roomId] = $scope.getVideoValue($scope.roomItems[room].items[0].supplierId, $scope.roomItems[room].roomId, $scope.roomItems[room].items[0].offeringId);
            }
          }

        }).error(function (e) {
          var a = 1;
        });
      }
    }

    init();
  })
