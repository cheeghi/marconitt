app
    .controller('LiberaRisorseCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, $q, $mdToast, $element, $rootScope, $httpParamSerializerJQLike, CONFIG) {

        $scope.teachers;
        $scope.classes;
        $scope.event = {};
        $scope.event.description;
        $scope.event.day = new Date();
        $scope.event.class;
        $scope.event.ore = [];
        $scope.isLoading = true; // used for loading circle


        /**
         * Initialization method
         */
        var init = function() {
             $http.get('http://localhost/timetable.php').success(function(response) {
                $scope.classes = response.classes;
                $scope.teachers = response.teachers;
                $scope.ore = response.ore;
                console.log($scope.teachers + "---------" + $scope.classes);
                 $timeout(function() { $scope.isLoading = false }, $rootScope.loadingTime);
            });
        };


        /**
         * sends event information to server
         */
        $scope.insert = function () {
            
            /*
                descrizione dell'evento = descrizione,
                giorno = day,
                ora di inizio = oraInizio,
                ora di fine = oraFine,
                classi = classi,
                stanze = stanze
            */

            var desc = $scope.event.description;
            var day = $scope.event.day.getFullYear() + "-" + ($scope.event.day.getMonth()+1) + "-" + $scope.event.day.getDate();
            var sClass = $scope.event.class; //$scope.event.class.toString().replace(/,(?=[^\s])/g, ", ");
            var sOre = $scope.event.ore; //$scope.event.ore.toString().replace(/,(?=[^\s])/g, ", ");
            var data = "descrizione="+desc+"&day="+day+"&classe="
                +sClass+"&ore="+sOre+"&token="+$rootScope.token;

            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/liberaRisorse',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            console.log(req.data);
            
            $http(req)
                .then(
                    function(data) {
                        $mdToast.show($mdToast.simple().textContent("Liberazione avvenuta con successo correttamente"));
                        $scope.event = {};
                        $scope.event.day = new Date();
                        $scope.event.ore = [];
                    },
                    function(err) {
                        $mdToast.show($mdToast.simple().textContent("Errore di rete: "+ err));
                    }
                );
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
