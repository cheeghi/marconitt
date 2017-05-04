app
    .controller('InsertCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, $q, $mdToast, $element, $rootScope, $httpParamSerializerJQLike, CONFIG) {

        $scope.teachers;
        $scope.classes;
        $scope.event = {};
        $scope.event.description;
        $scope.event.day = new Date();
        $scope.event.hourStart = new Date();
        $scope.event.hourEnd = new Date();
        $scope.event.classes = [];
        $scope.event.rooms = [];
        $scope.isLoading = true; // used for loading circle


        /**
         * Initialization method
         */
        var init = function() {
             $http.get('http://localhost/timetable.php').success(function(response) {
                $scope.classes = response.classes;
                $scope.teachers = response.teachers;
                $scope.rooms = response.rooms;
                console.log($scope.teachers + "---------" + $scope.classes);
                 $timeout(function() { $scope.isLoading = false }, $rootScope.loadingTime);
            });
        };


        /**
         * since angular hour picker returns hours and minutes without leading zeros,
         * this methods adds them and returns the sanitized value
         */        
        $scope.sanitize = function(value) {
            var out = '';

            if (value.toString().length == 1)
                out = '0' + value;
            else
                out = value;

            return out;
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

            var oreStart = $scope.sanitize($scope.event.hourStart.getHours());
            var minutiStart = $scope.sanitize($scope.event.hourStart.getMinutes());
            var oreEnd = $scope.sanitize($scope.event.hourEnd.getHours());
            var minutiEnd = $scope.sanitize($scope.event.hourEnd.getMinutes());

            var desc = $scope.event.description;
            var day = $scope.event.day.getFullYear() + "-" + ($scope.event.day.getMonth()+1) + "-" + $scope.event.day.getDate();
            var hStart = oreStart + ":" + minutiStart;
            var hEnd = oreEnd + ":" + minutiEnd;
            var sClasses = $scope.event.classes; //$scope.event.classes.toString().replace(/,(?=[^\s])/g, ", ");
            var sRooms = $scope.event.rooms; //$scope.event.rooms.toString().replace(/,(?=[^\s])/g, ", ");
            var data = "descrizione="+desc+"&day="+day+"&oraInizio="+hStart+"&oraFine="+hEnd+"&classi="
                +sClasses+"&stanze="+sRooms+"&token="+$rootScope.token;

            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/creaEvento',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            console.log(req.data);
            
            $http(req)
                .then(
                    function(data) {
                        $mdToast.show($mdToast.simple().textContent("Evento inserito correttamente"));
                        $scope.event = {};
                        $scope.event.day = new Date();
                        $scope.event.hourStart = new Date();
                        $scope.event.hourEnd = new Date();
                        $scope.event.classes = [];
                        $scope.event.rooms = [];
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
