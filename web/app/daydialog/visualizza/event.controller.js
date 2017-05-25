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
        

        /**
        * chiamata per iniziallizare il controller e iniziare il retrieve degli eventi
        */
        $scope.init = function() {

            $scope.eventsArray = [];
            $scope.isEmpty = false;
            $scope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();
            $scope.fillEvents($scope.giornoSelezionato);

        };


        /**
        * chiamata per re-iniziallizare il controller
        */
        $scope.$on("reInitEvents", function () {

            $scope.init();

        });


        /**
        * chiamata per recuperare gli eventi dal DB
        */
        $scope.fillEvents = function(giorno) {
            $http.get ('http://' + CONFIG.TIMETABLE, {
                cache: false,
                params: {
                    eventsbyday: giorno
                }

            }).success (function(response) {
                $scope.genArrayEvents(response);
                
            });
    }


        /**
        *  chiamata per riempire l'array di eventi per il giorno selezionato
        */
        $scope.genArrayEvents = function(response){

            if (response.length == 0) {
                $scope.isEmpty = true;

            } else {

                response.forEach(function(evento){
                    var a = {descrizione: evento.descrizione, classi: evento.classi, orainizio: evento.oraInizio, orafine:evento.oraFine, stanze:evento.stanze};
                    $scope.eventsArray.push(a);
                });
            }
        }

    });
