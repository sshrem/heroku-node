angular.module('DisignStudio')
  .controller('DesignSuppliersCtrl', function ($rootScope, $scope, Cloudinary, designByRoomFilter, $window, $http,
                                               $stateParams, debugData, $timeout, $location, $anchorScroll, uuid2,
                                               $cookies, $cookieStore) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/designsFilters';
    $scope.designRequestUrl = 'http://' + $rootScope.domain + '/api/designs';
    $scope.videoViewStatRequestUrl = 'http://' + $rootScope.domain + '/api/stats/recordVideoView';
    $scope.facebookShareStatRequestUrl = 'http://' + $rootScope.domain + '/api/stats/recordFacebookShare';

    var cloudinaryPath = "projects/shikunbinuidpchk/";
    var cloudinaryPath2 = "video:projects:shikunbinuidpchk:";

    $scope.roomItems;
    $scope.roomToWatch={
      val: "-1"
    };
    $scope.allSuppliers;
    $scope.videoList = [];
    $scope.roomOffering = [];
    $scope.defaultFacebookVideoUrl;
    $scope.facebookVideo = {url: null};
    $scope.videoDetails=[];
    $scope.videoLength=0
    $scope.videoStartTime=0;
    $scope.videoEndTime=0;
    $scope.design;
    $scope.id;

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

    $scope.getVideoValue = function (supplierId, roomId, offeringId) {
      $scope.roomOffering[roomId] = offeringId;
      var path = cloudinaryPath2 + $stateParams.aptId + ":";
      if (roomId == 2) {
        path = cloudinaryPath + $stateParams.aptId + "/";
      }
      path = path + supplierId + "_" + roomId + "_" + offeringId;

      return path;

    }

    $scope.getFacebookVideoUrl = function () {
      var filters = [];
      for (var ro  in $scope.roomOffering) {
        var room = parseInt(ro);
        var offer = $scope.roomOffering[ro];
        filters.push({room: room, offer: offer});
      }

      var data = {
        atId: $stateParams.aptId,
        projId: $stateParams.projId,
        supplierFilter: {
          supplier: null
        },
        itemFilters: filters
      };
      $http.post($scope.designRequestUrl, data)
        .success(function (res) {
          var url = null;
          if (res.data && res.data.designs && res.data.designs.length>0) {
            var url = res.data.designs[0].facebookVideoUrl;
            $scope.design = res.data.designs[0];
            $scope.sendVideoViewStatRequest();
          }
          if (url != null){
            $scope.facebookVideo = {url: url};
          } else {
            $scope.facebookVideo = {url: $scope.defaultFacebookVideoUrl};
          }
        }).error(function (e) {
          var a = 1;
        });
    };

    $scope.getUuid = function(){
      if ($scope.id == null) {
        $scope.id = $cookieStore.get("uuid");
      }

      if ($scope.id == null) {
        $scope.id = uuid2.newuuid();
        $cookieStore.put('uuid', $scope.id);
      }

      return $scope.id;
    }

    $scope.getRequestData = function () {

      var uuid = $scope.getUuid();
      var data = {
        userId: uuid,
        entrepreneurUserId: $rootScope.entrepreneurUserId,
        projectId: $stateParams.projId,
        apartmentTemplateId: $stateParams.aptId,
        roomId: $scope.roomToWatch.val,
        designId: $scope.design.id,
      };
      return data;
    }

    $scope.sendVideoViewStatRequest = function () {
      var data = $scope.getRequestData();
      $http.post($scope.videoViewStatRequestUrl, data);
    };

    $scope.sendFacebookShareStatRequest = function () {
      var data = $scope.getRequestData();
      $http.post($scope.facebookShareStatRequestUrl, data);
    };


    $scope.changeRoomToWatch = function(roomId){
      if (roomId==-1){
        $scope.videoStartTime = 0;
        $scope.videoEndTime = $scope.videoLength;
      } else {
        var video = $scope.videoDetails[roomId];
        $scope.videoStartTime = video.startTime;
        $scope.videoEndTime = video.endTime;
      }
      $scope.playDesignVideo();
      $scope.sendVideoViewStatRequest();
    };

    $scope.changeDesignVideo = function(){
      var isPaused = $('#video2').get(0).paused;
      // if (!isPaused){
      $scope.playDesignVideo();
      $scope.getFacebookVideoUrl();
      // }

    };
    $scope.playDesignVideo = function () {
      var mp4Url = Cloudinary.url($scope.videoList[2], {
        resource_type: 'video', format: 'mp4',
        transformation: [
          {overlay: $scope.videoList[1], flags: "splice"},
          {overlay: $scope.videoList[3], flags: "splice"},
        ]
      });

      var webmUrl = Cloudinary.url($scope.videoList[2], {
        resource_type: 'video', format: 'webm',
        transformation: [
          {overlay: $scope.videoList[1], flags: "splice"},
          {overlay: $scope.videoList[3], flags: "splice"},
        ]
      });

      var oggUrl = Cloudinary.url($scope.videoList[2], {
        resource_type: 'video', format: 'ogg',
        transformation: [
          {overlay: $scope.videoList[1], flags: "splice"},
          {overlay: $scope.videoList[3], flags: "splice"},
        ]
      });

      $('#video2 source[type="video/mp4"]').get(0).setAttribute("src", mp4Url);
      $('#video2 source[type="video/ogg"]').get(0).setAttribute("src", oggUrl);
      $('#video2 source[type="video/webm"]').get(0).setAttribute("src", webmUrl);
      var currentTime = $('#video2').get(0).currentTime;
      if (currentTime < $scope.videoStartTime || currentTime> $scope.videoEndTime){
        currentTime = $scope.videoStartTime;
      }

      $('#video2').get(0).load();
      if (currentTime >= 0 && currentTime < $scope.videoEndTime) {
        $('#video2').get(0).currentTime = currentTime;
      }
      $('#video2').get(0).play();
    }

    $('#video2').get(0).ontimeupdate = function(){
      var currentTime = this.currentTime;
      if (currentTime >= $scope.videoEndTime){
        this.pause();
        $('#video2').get(0).currentTime = $scope.videoStartTime;
      }
    }

    $('#video2').get(0).onended = function(){
      $('#video2').get(0).currentTime = $scope.videoStartTime;
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

    function extractedData(data) {
      $scope.allSuppliers = data.suppliers;
      $scope.roomItems = data.roomItems;
      $scope.defaultFacebookVideoUrl = data.defaultFacebookVideoUrl;

      for (var room in $scope.roomItems) {
        $scope.videoList[$scope.roomItems[room].roomId] = $scope.getVideoValue($scope.roomItems[room].items[0].supplierId, $scope.roomItems[room].roomId, $scope.roomItems[room].items[0].offeringId);
        $scope.roomOffering[$scope.roomItems[room].roomId] = $scope.roomItems[room].items[0].offeringId;
      }

      for (var room in data.videosDetails){
        var video = data.videosDetails[room];
        $scope.videoDetails[video.roomId] = video;
        $scope.videoLength = video.endTime;
        $scope.videoEndTime = video.endTime;
      }

      $scope.getFacebookVideoUrl();
    }

    function init() {
      if ($rootScope.isDebugMode) {
        var data = debugData.debugData.designSupplier;
        extractedData(data);
      } else {
        $http.post(initRequestUrl, {
          atId: $stateParams.aptId,
          projId: $stateParams.projId
        }).success(function (res) {
          if (res.data) {
            extractedData(res.data);
          }
        }).error(function (e) {
          var a = 1;
        });
      }
    }

    init();
  })
