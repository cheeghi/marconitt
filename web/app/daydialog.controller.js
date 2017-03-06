app
    .controller('DayDialogCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, $mdDateLocale, $rootScope,$httpParamSerializerJQLike, CONFIG, day) {

        $scope.day = day;
        $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();

        $scope.logged = $rootScope.logged;

        $scope.token = $rootScope.token;

        $scope.otherEvents = new Array();
        $scope.spaggiariEvents = new Array();

        $scope.data;
        $scope.events = new Array();

        getData = function() {
            console.log(day);
            var req = {
                method: 'GET',
                url: 'http://'+CONFIG.HOST+':8080/api/events/' + $scope.day.getFullYear() + "/" + $scope.day.getMonth() + "/" + $scope.day.getDate()
            }
            $http(req)
                .then(
                    function(data) {
                        $scope.data = data.data;
                        genEvents();
                    },
                    function(err) {
                        console.log(err);
                        $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi: " + err.data || "il server non risponde.."));
                    }
                );
        };

        $scope.delete = function(element, event) {
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/events/delete/' + event._id,
                data: $httpParamSerializerJQLike({ token: $rootScope.token }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.log(req);
            $http(req)
                .then(
                    function(data) {
                        console.log(data);
                        if (data.data.success) {
                            $mdToast.show($mdToast.simple().textContent("Evento eliminato"));
                            element.path[2].remove();
                        }
                    },
                    function(err) {
                        console.log(err);
                        $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi: " + err.data || "il server non risponde.."));
                    }
                );
        };

        $scope.toggleVisibility = function(element, event) {
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/events/visibility/' + event._id,
                data: $httpParamSerializerJQLike({ token: $rootScope.token, visible: !event.visible }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.log(req);
            $http(req)
                .then(
                    function(data) {
                        console.log(data);
                        if (data.data.success) {
                            $mdToast.show($mdToast.simple().textContent("Visibilità modificata"));
                            event.visible = !event.visible;
                        }
                    },
                    function(err) {
                        console.log(err);
                        $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi: " + err.data || "il server non risponde.."));
                    }
                );
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        genEvents = function() {
            /*$scope.data.forEach(function(event) {
                if (event.type == 0) {
                    $scope.otherEvents.push(event);
                }
            });
            $scope.data.forEach(function(event) {
                if (event.type == 1) {
                    $scope.spaggiariEvents.push(event);
                }
            });*/
            $scope.data.forEach(function(event) {
                if (event.visible || $rootScope.logged) $scope.events.push(event);
            });
        }


        getData();
    });
