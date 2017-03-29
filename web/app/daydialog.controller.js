app
    .controller('DayDialogCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, $mdDateLocale, $rootScope, $httpParamSerializerJQLike, CONFIG, day) {

        $scope.day = day;
        $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();
        $scope.logged = $rootScope.logged;
        $scope.otherEvents = new Array();
        $scope.spaggiariEvents = new Array();
        $scope.data;
        $scope.events = new Array();


        /** 
        $scope.incrementDay = function() {
            console.log("incrementato");
            $scope.day.setDate($scope.day.getDate() + 1);
        };*/


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

        $scope.$on("dimension", function (event, args) {
            $scope.dimension();
        });

        $scope.dimension = function() {
			var boolD = false;
		
			//fix table dimension
            var table = document.getElementById("orario");
            var tableHeight = table.clientHeight;
            var tableWidth = table.clientWidth;
            if (boolD) {
				console.log("fix table dimension height: " + tableHeight);
				console.log("fix table dimension width: " + tableWidth);
			}
			
			//page dimension
			var page = document.getElementById("contentPrenotazione");
			var pageWidth = page.clientWidth;
            var pageHeight = page.clientHeight;
			if (boolD) {
				console.log("page dimension width: " + pageWidth);
                console.log("page dimension height: " + pageHeight);
			}
			
            if (tableWidth > pageWidth && tableHeight > pageHeight) {
                console.log("inserire scroll verticale");
                if (boolD) {
                    console.log("width fix table: " + tableWidth);
                    console.log("width page: " + pageWidth);
                    console.log("inserire scroll orizzontale");
                    console.log("height fix table: " + tableHeight);
                    console.log("height page: " + pageHeight);
                    console.log("inserire scroll verticale");
                }
                //add vertical and orizzontal scroll
            } else if (tableWidth > pageWidth) {
                console.log("inserire scroll orizzontale");
				if (boolD) {
					console.log("width fix table: " + tableWidth);
					console.log("width page: " + pageWidth);
					console.log("inserire scroll orizzontale");
				}
                //add orizzontal scroll
			} else if (tableHeight > pageHeight) {
                console.log("inserire scroll verticale");
                if (boolD) {
                    console.log("height fix table: " + tableHeight);
                    console.log("height page: " + pageHeight);
                    console.log("inserire scroll verticale");
                }
                //add vertical scroll
            } else {
                console.log("normal dimension");
                console.log("table width: " + tableWidth);
                console.log("table height: " + tableHeight);
                console.log("page width: " + pageWidth);
                console.log("page height: " + pageHeight);
            }
			
        }

        getData();
    });
