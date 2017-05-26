app
    .controller('InsertCtrl', function($scope, $timeout, $http, $mdToast, $rootScope, CONFIG) {

        $scope.classes; // list of classes
        $scope.rooms; // list of rooms
        $scope.eventsRooms; // list of special rooms
        $scope.event = {};
        $scope.event.description; // description of the event
        $scope.event.day = new Date(); // day of the event
        $scope.event.hourStart = new Date(); // hour at which the event starts
        $scope.event.hourEnd = new Date(); // hour at which the event ends
        $scope.event.classes = []; // list of selected classes
        $scope.event.rooms = []; // list of selected rooms
        $scope.isLoading = true; // used for loading circle


        /**
         * Initialization method
         */
        var init = function() {
            $http.get('http://'+CONFIG.TIMETABLE)
                .success(function(response) {

                    $scope.classes = response.classes;
                    $scope.rooms = response.rooms;
                    $scope.eventsRooms = response.eventsrooms;
                
                    $timeout(function() {
                        $scope.isLoading = false
                    }, $rootScope.loadingTime);

                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });
        };


        /**
         * since angular hour picker returns hours and minutes without leading zeros,
         * this methods adds them and returns the sanitized value
         * @param value
         * @returns boolean
         */        
        $scope.sanitize = function(value) {
            return value.toString().length == 1 ? '0' + value : value;
        };


        /**
         * sends event information to server
         */
        $scope.insert = function () {

            var oreStart = $scope.sanitize($scope.event.hourStart.getHours());
            var minutiStart = $scope.sanitize($scope.event.hourStart.getMinutes());
            var oreEnd = $scope.sanitize($scope.event.hourEnd.getHours());
            var minutiEnd = $scope.sanitize($scope.event.hourEnd.getMinutes());

            var desc = $scope.event.description;
            var day = $scope.event.day.getFullYear() + "-" + ($scope.event.day.getMonth()+1) + "-" + $scope.event.day.getDate();
            var hStart = oreStart + ":" + minutiStart;
            var hEnd = oreEnd + ":" + minutiEnd;
            var sClasses = $scope.event.classes;
            var sRooms = $scope.event.rooms;
            var data = "descrizione="+desc+"&day="+day+"&oraInizio="+hStart+"&oraFine="+hEnd+"&classi="+sClasses+"&stanze="+sRooms+"&token="+sessionStorage.token;

            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/creaEvento',
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            $http(req)
                .then(
                    function(data) {
                        if (data) {
                            $mdToast.show($mdToast.simple().textContent("Evento inserito correttamente"));
                            $scope.event = {};
                            $scope.event.day = new Date();
                            $scope.event.hourStart = new Date();
                            $scope.event.hourEnd = new Date();
                            $scope.event.classes = [];
                            $scope.event.rooms = [];   
                        } else {
                            $mdToast.show($mdToast.simple().textContent("Errore durante l'inserimento"));
                        }
                    },
                    function(err) {
                        $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                    }
                );
        };


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
