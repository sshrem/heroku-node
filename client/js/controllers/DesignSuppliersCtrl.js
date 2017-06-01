angular.module('DisignStudio')
  .controller('DesignSuppliersCtrl', function ($rootScope, $scope, Cloudinary, designByRoomFilter, $window, $http,
                                               $stateParams, debugData, $timeout, $location, $anchorScroll) {

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
    $scope.videoListData={};
    $scope.videoList = [];
    $scope.defaultFacebookVideoUrl;
    $scope.facebookVideo = {url: null};
    $scope.videoDetails=[];
    $scope.videoRoomList=[];
    $scope.videoLength=0;
    $scope.videoStartTime=0;
    $scope.videoEndTime=0;
    $scope.design;

    $location.hash('apartment-nav');
    $anchorScroll();

    $(document).ready(function () {
      $('.tooltipped').tooltip({delay: 50});
      $('.collapsible').collapsible();
      $scope.playDesignVideo();
    });

    $timeout(function () {
      $('.collapsible-header').addClass('active');
      $('.collapsible').collapsible();
    }, 1000);

    $scope.getVideoValue = function (supplierId, roomId, offeringId) {
      if (roomId == 4){ // kitchen - living room and kitchen in the same video
        return "_" + roomId + "_" + offeringId;
      }

      var path = cloudinaryPath2 + $stateParams.aptId + ":";
      if (roomId == 2) {  // living room - the first video
        path = cloudinaryPath + $stateParams.aptId + "/";
      }
      path = path + supplierId + "_" + roomId + "_" + offeringId;

      return path;
    }

    $scope.getVideoValueData = function (supplierId, roomId, offeringId) {
      return $scope.videoListData[''+supplierId][''+roomId][''+offeringId];
    }

    $scope.getFacebookVideoUrl = function () {
      var filters = [];
      for (var ro  in $scope.videoList) {
        var offer = $scope.videoList[ro];
        filters.push({room: offer.roomId , offer: offer.offeringId});
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

    $scope.getRequestData = function () {
      var uuid = $rootScope.getUuid();
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
      if ($rootScope.shouldSendStats){
        var data = $scope.getRequestData();
        $http.post($scope.videoViewStatRequestUrl, data);
      }
    };

    $scope.sendFacebookShareStatRequest = function () {
      if ($rootScope.shouldSendStats){
        var data = $scope.getRequestData();
        $http.post($scope.facebookShareStatRequestUrl, data);
      }
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
      // var isPaused = $('#video2').get(0).paused;
      $scope.playDesignVideo();
      $scope.getFacebookVideoUrl();

    };
    $scope.playDesignVideo = function () {
      var path = cloudinaryPath2 + $stateParams.aptId + ":";
      var videoList1Path = $scope.getVideoValue($scope.videoList[2].supplierId, 1, $scope.videoList[2].offeringId);

      var mp4Url = Cloudinary.url($scope.videoList[2].path + $scope.videoList[4].path, {
        resource_type: 'video', format: 'mp4',
        transformation: [
          {overlay: videoList1Path, flags: "splice"},
          {overlay: $scope.videoList[3].path, flags: "splice"},
        ]
      });

      var webmUrl = Cloudinary.url($scope.videoList[2].path + $scope.videoList[4].path, {
        resource_type: 'video', format: 'webm',
        transformation: [
          {overlay: videoList1Path, flags: "splice"},
          {overlay: $scope.videoList[3].path, flags: "splice"},
        ]
      });

      var oggUrl = Cloudinary.url($scope.videoList[2].path + $scope.videoList[4].path, {
        resource_type: 'video', format: 'ogg',
        transformation: [
          {overlay: videoList1Path, flags: "splice"},
          {overlay: $scope.videoList[3].path, flags: "splice"},
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
        case 4:
          return "kitchen";
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

      for (var r in $scope.roomItems) {
        var room = $scope.roomItems[r];
        var roomId = room.roomId;
        for (var i in room.items){
          var item = room.items[i];
          var supplierId = item.supplierId;
          var offeringId = item.offeringId;
          var path = $scope.getVideoValue(supplierId, roomId, offeringId);
          var vlData = { "path": path, "supplierId": supplierId, "roomId": roomId, "offeringId": offeringId};

          if (!$scope.videoList[roomId]){
            $scope.videoList[roomId] = vlData;
            if (roomId == 2){ // living room & kitchen
              path = $scope.getVideoValue(supplierId, 1, offeringId);
              $scope.videoList[1] = { "path": path, "supplierId": supplierId, "roomId": 1, "offeringId": offeringId};
            }
          }

          if(!$scope.videoListData[''+supplierId]){
            $scope.videoListData[''+supplierId]={};
          }

          if(!$scope.videoListData[''+supplierId][''+roomId]){
            $scope.videoListData[''+supplierId][''+roomId]={};
          }

          $scope.videoListData[''+supplierId][''+roomId][''+offeringId] = vlData;

        }
      }


      for (var room in data.videosDetails){
        var video = data.videosDetails[room];
        $scope.videoDetails[video.roomId] = video;
        $scope.videoRoomList.push(video);
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
