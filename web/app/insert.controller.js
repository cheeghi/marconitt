app
    .controller('InsertCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, $q, $mdToast, $element, $rootScope, $httpParamSerializerJQLike, CONFIG) {

        $scope.whos = []
        $scope.searchTerm;
        $scope.msg = 'Clicca per testare';
        $scope.event;

        $scope.noSunday = function(date) {
            var day = date.getDay();
            return day !== 0;
        }

        var init = function() {
            var req = {
                method: 'GET',
                url: 'http://'+CONFIG.HOST+':8080/api/who'
            }

            $http(req)
                .then(
                    function(data) {
                        $scope.whos = data.data;
                    },
                    function(err) {
                        console.log(err);
                    }
                );
        }


        $scope.clearSearchTerm = function() {
            $scope.searchTerm = '';
        };

        var numFmt = function(num) {
            num = num.toString();
            if (num.length < 2) {
                num = "0" + num;
            }
            return num;
        };

        $scope.insert = function() {
          if ($rootScope.logged) {
            who = [];
            for (var k in $scope.event.whos) {
                if ($scope.event.whos.hasOwnProperty(k)) {
                    $scope.event.whos[k].forEach(function(w) {
                      who.push(w._id);
                    });
                }
            }
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/events/' + $scope.event.date.getFullYear() + "/" + $scope.event.date.getMonth() + "/" + $scope.event.date.getDate(),
                data: $httpParamSerializerJQLike({
                    hour_start: numFmt($scope.event.hour_start.getHours()) + "." + numFmt($scope.event.hour_start.getMinutes()),
                    hour_end: numFmt($scope.event.hour_end.getHours()) + "." + numFmt($scope.event.hour_end.getMinutes()),
                    description: $scope.event.description,
                    who: who.join(","),
                    visible: $scope.event.visible,
                    token: $rootScope.token
                }),
               headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
               }
            }

            console.log(req);

            $http(req)
                .then(
                    function(data) {
                        $mdToast.show($mdToast.simple().textContent("Evento inserito correttamente"));
                        $scope.event = {};
                    },
                    function(err) {
                        $mdToast.show($mdToast.simple().textContent("Errore di rete: "+ err));
                    }
                );
              } else {
                $mdToast.show($mdToast.simple().textContent("Non risulti loggato nel sistema"));
              }
        }

        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        init();

    });
