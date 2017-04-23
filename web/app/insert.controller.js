app
    .controller('InsertCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, $q, $mdToast, $element, $rootScope, $httpParamSerializerJQLike, CONFIG) {

        $scope.teachers;
        $scope.classes;
        $scope.event = {};
        $scope.event.description = '';
        $scope.event.day = new Date();
        $scope.event.hourStart = new Date();
        $scope.event.hourEnd = new Date();
        $scope.event.classes = [];
        $scope.event.rooms = [];


        /**
         * Initialization method
         */
        var init = function() {
             $http.get('http://localhost/timetable.php').success(function(response) {
                $scope.classes = response.classes;
                $scope.teachers = response.teachers;
                $scope.rooms = response.rooms;
                console.log($scope.teachers + "---------" + $scope.classes);
            });
        };


        /**
         * sends event information to server
         */
        $scope.insert = function () {
            var desc = $scope.event.description;
            var day = $scope.event.day.getFullYear() + "-" + ($scope.event.day.getMonth()+1) + "-" + $scope.event.day.getDate();
            var hStart = $scope.event.hourStart.getHours() + ":" + $scope.event.hourStart.getMinutes();
            var hEnd = $scope.event.hourEnd.getHours() + ":" + $scope.event.hourEnd.getMinutes();
            var sClassesToString = $scope.event.classes.toString().replace(/,(?=[^\s])/g, ", ");
            var sRoomsToString = $scope.event.rooms.toString().replace(/,(?=[^\s])/g, ", ");
            var data = "descrizione="+desc+"&day="+day+"&oraInizio="+hStart+"&oraFine="+hEnd+"&classi="
                +sClassesToString+"&stanze="+sRoomsToString+"&token="+$rootScope.token;

            var req = {
                method: 'POST',
                //url: 'http://'+CONFIG.HOST+':8080/api/events/' + $scope.event.date.getFullYear() + "/" + $scope.event.date.getMonth() + "/" + $scope.event.date.getDate(),
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            console.log(req.data);

            /*
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
            */

        }


        $scope.noSunday = function(date) {
            var day = date.getDay();
            return day !== 0;
        };


        init();
    });
