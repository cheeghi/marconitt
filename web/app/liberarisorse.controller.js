app
    .controller('LiberaRisorseCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, $q, $mdToast, $element, $rootScope, $httpParamSerializerJQLike, CONFIG, $mdDialog) {

        $scope.teachers;
        $scope.classes;
        $scope.event = {};
        $scope.event.description;
        $scope.event.day = new Date();
        $scope.event.class;
        $scope.event.ore;
        $scope.isLoading = true; // used for loading circle


        /**
         * Initialization method
         */
        var init = function() {
            $http.get('http://'+CONFIG.TIMETABLE)
                .success(function(response) {
                    $scope.classes = response.classes;
                    $scope.teachers = response.teachers;
                    $scope.ore = response.ore;
                    $timeout(function() { $scope.isLoading = false }, $rootScope.loadingTime);
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });
        };


        /**
         * sends event information to server
         */
        $scope.insert = function () {
            var confirm = $mdDialog.confirm()
              .textContent('La risorsa verrà liberata per sempre. Continuare?')
              .ok('CONFERMA')
              .cancel('ANNULLA');

            $mdDialog.show(confirm).then(function() {
                var desc = $scope.event.description;
                var day = $scope.event.day.getFullYear() + "-" + ($scope.event.day.getMonth()+1) + "-" + $scope.event.day.getDate();
                var sClass = $scope.event.class; //$scope.event.class.toString().replace(/,(?=[^\s])/g, ", ");
                var sOre = $scope.event.ore; //$scope.event.ore.toString().replace(/,(?=[^\s])/g, ", ");
                var data = "descrizione="+desc+"&day="+day+"&classe="
                    +sClass+"&ore="+sOre+"&token="+sessionStorage.token;

                var req = {
                    method: 'POST',
                    url: 'http://'+CONFIG.HOST+':8080/api/liberaRisorse',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                $http(req)
                    .then(
                        function(data) {
                            if (data) {
                                $mdToast.show($mdToast.simple().textContent("Risorsa liberata con successo"));
                                $scope.event = {};
                                $scope.event.day = new Date();   
                            } else {
                                $mdToast.show($mdToast.simple().textContent("Errore durante la liberazione"));
                            }
                        },
                        function(err) {
                            $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                        }
                    );
            });    
        }


        /**
         * says if a day is sunday or not
         * @param date
         * @returns {boolean}
         */
        $scope.noSunday = function(date) {
            var day = date.getDay();
            return day !== 0;
        };


        // on start
        init();
    });
