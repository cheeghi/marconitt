app.
    controller("EventCtrl", function($scope, $rootScope, $filter, $http, $q, $window, $sce, $mdDateLocale, $timeout, CONFIG) {

        $scope.day;
        $rootScope.selectedDate;
        $scope.currentItem = '';
        $scope.data;
        $scope.events;
        $scope.eventsArray = [];
        $scope.isEmpty;
        $scope.listItem = "";
        
        //$scope.test == $rootScope.selectedDate;
        

        $scope.init = function() {
            $scope.eventsArray = [];
            $scope.isEmpty = false;
            $scope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();
            console.log($scope.giornoSelezionato);
            $scope.fillEvents($scope.giornoSelezionato);
        };

        $scope.$on("reInitEvents", function () {
            $scope.init();
        });

        $scope.fillEvents = function(giorno) {
            $http.get('http://' + CONFIG.TIMETABLE, {
                cache: false,
                params: {
                    eventsbyday: giorno
                }
            }).success(function(response) {
                $scope.genArrayEvents(response);
                
            });
    }
        $scope.genArrayEvents = function(response){

            if (response.length == 0) {
                $scope.isEmpty = true;

            }else{
                response.forEach(function(evento){
                var a = {descrizione: evento.descrizione, classi: evento.classi, orainizio: evento.oraInizio, orafine:evento.oraFine, stanze:evento.stanze};
                //console.log(a);
                $scope.eventsArray.push(a);
            });
            }
        }


    });
