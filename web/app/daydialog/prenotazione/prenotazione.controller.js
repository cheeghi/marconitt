app.
    controller("PrenotazioneCtrl", function($scope, $http, $mdDialog, $mdToast, $rootScope, CONFIG) {
     
        $scope.day; // selected day
        $scope.isHoliday = true; // says if the selected day is holiday or not
        $scope.htmlTable = ""; // 'prenotazioni' table html code
        $scope.admin = $rootScope.admin; // is admin or not
        $scope.isLoading; // boolean for showing isLoading circle
        $scope.classes; // list of classes
        $scope.teachers; // list of teachers
        $scope.rooms; // list of rooms
        $scope.classrooms; // list of classrooms
        $scope.labs; // list of laboratories
        $scope.sRoomType; // type of selected room (lab or classroom)
        $scope.sRoom; // selected room
        $scope.sHour; // selected hour
        $rootScope.stanzaPrenotata; // selected room that has to be passed to confermaprenotazione.controller
        $rootScope.oraPrenotata; // selected hour that has to be passed to confermaprenotazione.controller
        $rootScope.prenotazioneString; // prenotazione string that has to be passed to confermaprenotazione.controller


        /**
         * initialization method
         */
        $scope.init = function() {

            $scope.initializeHttpCalls();
            $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();

            // do the check if the selected day is holiday or not
            $http.get('http://' + CONFIG.HOST + ':' + CONFIG.PORT + '/isholiday', {
                cache: false,
                params: {
                    day: $rootScope.giornoSelezionato
                }
            }).success(function(response) {

                $scope.isHoliday = response;
                $scope.htmlTable = ($scope.isHoliday) ? "<p>Non c'è scuola oggi, prenditi una pausa!</p>" : "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";

            }).error(function() {
                $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
            });
        };


        /**
         * makes http requests to populate classes, rooms, teachers, labs and classrooms arrays
         */
        $scope.initializeHttpCalls = function() {
            $http.get('http://' + CONFIG.HOST + ':' + CONFIG.PORT + '/default')
                .success(function(response) {
                
                    $scope.classrooms = response.classrooms;
                    $scope.labs = response.labs;
                
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });
        };


        /**
         * re-initialization method
         * method called when the user change the day with the right/left arrows
         * @param date
         */
        $scope.reInit = function(date) {

            $scope.htmlTable = '';
            $scope.day = new Date(date);
            $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();

            // do the check if the selected day is holiday or not
            $http.get('http://' + CONFIG.HOST + ':' + CONFIG.PORT + '/isholiday', {
                cache: false,
                params: {
                    day: $rootScope.giornoSelezionato
                }
            }).success(function(response) {

                $scope.isHoliday = response;
                if ($scope.isHoliday)
                     $scope.htmlTable = "<p>Non c'è scuola oggi, prenditi una pausa!</p>";
                else if(!$scope.sRoomType || $scope.isLoading)
                    $scope.htmlTable = "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
                else
                    $scope.getPrenotazioni();

            }).error(function() {
                $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
            });
        };


        /**
         * calls timetable API and passes the response to genTable() method
         */
        $scope.getPrenotazioni = function() {

            $scope.htmlTable = '';
            $scope.isLoading = true;

            if ($scope.sRoomType == "LABORATORIO") {
                $http.get('http://' + CONFIG.HOST + ':' + CONFIG.PORT + '/labroomsbydate', {
                    cache: false,
                    params: {
                        day: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {
                    
                    $scope.genTable(response);
                    $scope.isLoading = false;
                    
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                });

            } else if ($scope.sRoomType == "AULA") {
                $http.get('http://' + CONFIG.HOST + ':' + CONFIG.PORT + '/classroomsbydate', {
                    cache: false,
                    params: {
                        day: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {
                    
                    $scope.genTable(response);
                    $scope.isLoading = false;
                    
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                });
            }
        };


        /**
         * clears sRoom and sHour selections
         */
        $scope.clearMdSelect = function() {
            $scope.sRoom = undefined;
            $scope.sHour = undefined;
        };


        /**
         * generates "prenotazioni" table
         * @param responses
         */
        $scope.genTable = function(responses) {

            var x = "<table class=\"table table_prenotazioni\">\
                    <thead><tr>\
                        <th class='border_prenotazionitable'>&nbsp;</th>\ ";
                        
            if (!$scope.sHour || $scope.sHour == 'Qualsiasi') {
                x += "<th class='border_prenotazionitable'>1°<md-tooltip md-direction='top'>8:00 - 9:00</md-tooltip></th>\
                        <th class='border_prenotazionitable'>2°<md-tooltip md-direction='top'>9:00 - 9:50</md-tooltip></th>\
                        <th class='border_prenotazionitable'>3°<md-tooltip md-direction='top'>10:00 - 11:00</md-tooltip></th>\
                        <th class='border_prenotazionitable'>4°<md-tooltip md-direction='top'>11:00 - 11:50</md-tooltip></th>\
                        <th class='border_prenotazionitable'>5°<md-tooltip md-direction='top'>12:00 - 12:55</md-tooltip></th>\
                        <th class='border_prenotazionitable'>6°<md-tooltip md-direction='top'>12:55 - 14:30</md-tooltip></th>\
                        <th class='border_prenotazionitable'>7°<md-tooltip md-direction='top'>14:30 - 15:30</md-tooltip></th>\
                        <th class='border_prenotazionitable'>8°<md-tooltip md-direction='top'>15:30 - 16:30</md-tooltip></th>\
                        <th class='border_prenotazionitable'>9°<md-tooltip md-direction='top'>16:30 - 17:30</md-tooltip></th>\
                        <th class='border_prenotazionitable'>10°<md-tooltip md-direction='top'>17:30 - 18:30</md-tooltip></th>\ ";
            } else {
                var tooltipText;
                switch ($scope.sHour) {
                    case "1":
                        tooltipText = '8:00 - 9:00';
                        break;
                    case "2":
                        tooltipText = '9:00 - 9:50';
                        break;
                    case "3":
                        tooltipText = '10:00 - 11:00';
                        break;
                    case "4":
                        tooltipText = '11:00 - 11:50';
                        break;
                    case "5":
                        tooltipText = '12:00 - 12:55';
                        break;
                    case "6":
                        tooltipText = '12:55 - 14:30';
                        break;
                    case "7":
                        tooltipText = '14:30 - 15:30';
                        break;
                    case "8":
                        tooltipText = '15:30 - 16:30';
                        break;
                    case "9":
                        tooltipText = '16:30 - 17:30';
                        break;
                    case "10":
                        tooltipText = '17:30 - 18:30';
                        break;
                }
                x += "<th class='border_prenotazionitable'>"+$scope.sHour+"°<md-tooltip md-direction='top'>"+tooltipText+"</md-tooltip></th>";
            }

            x += "</tr></thead>";
            x += "<tbody>";
            
            for (var key in responses) {
                if (key == "")
                    continue;
                
                if ($scope.sRoom && $scope.sRoom != 'Qualsiasi') {
                    if ($scope.sRoom == key)
                        x += "<tr><td style='border: 0.5px solid white;'>" + key + "</td>";
                } else
                    x += "<tr><td style='border: 0.5px solid white;'>" + key + "</td>";
                
                responses[key].forEach(function(element) {

                    if ($scope.sRoom && $scope.sRoom != 'Qualsiasi') {
                        if ($scope.sRoom == element.stanza) {
                            if ($scope.sHour && $scope.sHour != 'Qualsiasi') {
                                if (element.ora == $scope.sHour)
                                    x += element.risorsa ? '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>' : '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';
                            } else
                                x += element.risorsa ? '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>' : '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';                                
                        }
                    } else {
                        if ($scope.sHour && $scope.sHour != 'Qualsiasi') {
                            if (element.ora == $scope.sHour)
                               x += element.risorsa ? '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>' : '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';                                
                        } else
                            x += element.risorsa ? '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>' : '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';
                    }
                    
                }, this);
                x += "</tr>";
            }

            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
        };


        /**
         * opens reservation confirm dialog and set stanzaPrenotata, oraPrenotata and prenotazioneString (used in ConfermaPrenotazioneCtrl)
         */
        $scope.prenotaClick = function(stanza, ora) {
            $rootScope.stanzaPrenotata = stanza;
            $rootScope.oraPrenotata = ora;
            $rootScope.prenotazioneString = stanza + ' - ' + (ora) + '°ora';
            $mdDialog.show({
                templateUrl: 'tpl/daydialog/confermaprenotazione.tpl.html',
                controller: 'ConfermaPrenotazioneCtrl',
                clickOutsideToClose: true,
                skipHide: true
            });
        };


        /**
         * called by other controllers in order to re-initialize the controller
         * @param event
         * @param args
         */
        $scope.$on("reInitPrenota", function (event, args) {
            $scope.reInit(args.day);
        });


        /**
         * called by other controllers in order to refresh the 'prenotazioni' table
         * @param event
         * @param args
         */
        $scope.$on("refreshTable", function (event, args) {
            $scope.getPrenotazioni();
        });


        /**
         * shows an alert message if the user clicks on 'ora già prenotata'
         */
        $scope.aulaPrenotata = function(){
            if ($scope.sRoomType == "LABORATORIO")
                $mdToast.show($mdToast.simple().textContent('Laboratorio non prenotabile!').hideDelay(1500));
            else if ($scope.sRoomType == "AULA")
                $mdToast.show($mdToast.simple().textContent('Aula non prenotabile!').hideDelay(1500));
        };

    });