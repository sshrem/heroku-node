angular.module('DisignStudio')
  .filter('designByRoom', function() {
    return function(input, type) {

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
  .controller('DesignSuppliersCtrl', function($rootScope, $scope,Cloudinary, designByRoomFilter, $window, $http, $stateParams) {

    var initRequestUrl = 'http://' + $rootScope.domain + '/api/mobile/designsFilters';

    $scope.roomItems;
    $scope.itemFilters=[];
    $scope.allSuppliers;
    $rootScope.selected=[];
    $(document).ready(function(){
      $('.tooltipped').tooltip({delay: 50});
      $('.collapsible').collapsible({});
    });

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

      $scope.isChecked =function(index) {
          return index==0;
      }



      function init() {
      if ($rootScope.isDebugMode) {
        $scope.data = {
          "title": "דירת 4 חדרים | טיפוס B2",
          "suppliers": [
            {
              "id": 1,
              "name": null,
              "logo": "suppliers/zehavi/zehavi-logo",
              "url": null
            }
          ],
          "roomItems": [
            {
              "title": "chooselivingroomfloor",
              "roomId": 2,
              "items": [
                {
                  "offeringId": 5,
                  "name": "Imperial Crema 60x60",
                  "imgCode": "suppliers/zehavi/clearcrema.jpg",
                  "supplierId": 1
                },
                {
                  "offeringId": 6,
                  "name": "Manhatan Ivory 60x60",
                  "imgCode": "suppliers/zehavi/manhatanivory.jpg",
                  "supplierId": 1
                },
                {
                  "offeringId": 14,
                  "name": "Clear Tobbaco 60x60",
                  "imgCode": "suppliers/zehavi/cleartobbaco_.jpg",
                  "supplierId": 1
                }
              ]
            }
            ,
            {
              "title": "choosebedroomfloor",
              "roomId": 1,
              "items": [
                {
                  "offeringId": 5,
                  "name": "Imperial Crema 60x60",
                  "imgCode": "suppliers/zehavi/clearcrema.jpg",
                  "supplierId": 1
                },
                {
                  "offeringId": 6,
                  "name": "Manhatan Ivory 60x60",
                  "imgCode": "suppliers/zehavi/manhatanivory.jpg",
                  "supplierId": 1
                },
                {
                  "offeringId": 13,
                  "name": "פרקט כרמל Classic Frontal",
                  "imgCode": "suppliers/zehavi/Carmel_Classic_Frontal.jpg",
                  "supplierId": 1
                }
              ]
            },
            {
              "title": "choosebathroomcladding",
              "roomId": 3,
              "items": [
                {
                  "offeringId": 10,
                  "name": "Vetro Marfil 20x60",
                  "imgCode": "suppliers/zehavi/vetromarfil.jpg",
                  "supplierId": 1
                },
                {
                  "offeringId": 11,
                  "name": "Rain White 20x50",
                  "imgCode": "suppliers/zehavi/rainwhite.jpg",
                  "supplierId": 1
                },
                {
                  "offeringId": 12,
                  "name": "Ethos Gris 20x60",
                  "imgCode": "suppliers/zehavi/ethosgris.jpg",
                  "supplierId": 1
                }
              ]
            }
          ]
        };
        $scope.allSuppliers = $scope.data.suppliers;
        $scope.roomItems = $scope.data.roomItems;
        for(var room in $scope.roomItems){
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
        }).success(function(res) {
          if (res.data) {
            $scope.allSuppliers = res.data.suppliers;
            $scope.roomItems = res.data.roomItems;
            for(var room in $scope.roomItems){
                $rootScope.selected[room] = {
                    room: $scope.roomItems[room].roomId,
                    offer: $scope.roomItems[room].items[0].offeringId
                };

                $scope.itemFilters[room] = $scope.roomItems[room].roomId + "_" + $scope.roomItems[room].items[0].offeringId;
            }
          }
        }).error(function(e) {
          var a=1;
        });
      }
    }

    init();
  })
