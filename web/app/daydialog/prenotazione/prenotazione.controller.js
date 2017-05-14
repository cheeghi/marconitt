app.
    controller("PrenotazioneCtrl", function($scope, $http, $window, $mdDialog, $mdToast, $rootScope, CONFIG) {
     
        $scope.day;
        $scope.currentItem = '';
        $scope.classes = [];
        $scope.isSunday = true;
        $scope.htmlTable = ""; // 'prenotazioni' table html code
        $scope.all = false;
        $scope.admin = $rootScope.admin; // is protocollo or not
        $scope.isLoading; // boolean for showing isLoading circle
        $scope.classes; // list of classes
        $scope.teachers; // list of teachers
        $scope.rooms; // list of rooms
        $scope.classrooms; // list of classrooms
        $scope.labs; // list of laboratories
        $scope.sRoomType; // type of selected room (lab or classroom)
        $scope.sRoom; // selected room
        $scope.sHour; // selected hour


        /**
         * initialize method
         */
        $scope.init = function(date) {
            $scope.initializeHttpCalls();
            $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1)
                + "-" + $scope.day.getDate();
            $scope.isSunday = $scope.day.getDay() == 0;
            $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
        }


        /**
         * makes http requests to populate classes, rooms, teachers, labs and classrooms arrays
         */
        $scope.initializeHttpCalls = function() {
            $http.get('http://'+CONFIG.TIMETABLE)
                .success(function(response) {
                    $scope.classrooms = response.classrooms;
                    $scope.labs = response.labs;
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });
        };


        /**
         * re-initialize method
         */
        $scope.reInit = function(date) {
            $scope.htmlTable = '';
            $scope.day = new Date(date);
            $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1)
                + "-" + $scope.day.getDate();
            $scope.isSunday = $scope.day.getDay() == 0;
            
            if ($scope.isSunday){
                 $scope.htmlTable = "<p>Non c'è scuola di domenica</p>";
            } else if($scope.sRoomType == undefined || $scope.isLoading) {
                $scope.htmlTable = "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
            } else {
                $scope.getPrenotazioni();
            }
        }


        /**
         * calls timetable API and passes the response to genTable() method
         */
        $scope.getPrenotazioni = function() {
            $scope.htmlTable = '';
            $scope.isLoading = true;
            if ($scope.sRoomType == "LABORATORIO") {
                $http.get('http://'+CONFIG.TIMETABLE, {
                    cache: false,
                    params: {
                        labroomsbydate: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {
                    $scope.genTable(response.rooms);
                    $scope.isLoading = false;
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                });
                $scope.dim(); //for scrollbar

            } else if ($scope.sRoomType == "AULA") {
                $http.get('http://'+CONFIG.TIMETABLE, {
                    cache: false,
                    params: {
                        classroomsbydate: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {
                    $scope.genTable(response.rooms);
                    $scope.isLoading = false;
                    $scope.dim(); //for scrollbar (leo)
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


        $scope.dim = function() {
            $rootScope.$broadcast("dimension", {});
        }


        /**
         * generates "prenotazioni" table
         */
        $scope.genTable = function(responses) {

            var x = "<table class=\"table table_prenotazioni\">\
                    <thead><tr>\
                        <th style='border: 0.5px solid white;'>&nbsp;</th>\ ";
                        
            if ($scope.sHour == undefined || $scope.sHour == 'Qualsiasi') {
                x += "<th style='border: 0.5px solid white;'>1°<md-tooltip md-direction='top'>8:00 - 9:00</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>2°<md-tooltip md-direction='top'>9:00 - 9:50</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>3°<md-tooltip md-direction='top'>10:00 - 11:00</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>4°<md-tooltip md-direction='top'>11:00 - 11:50</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>5°<md-tooltip md-direction='top'>12:00 - 12:55</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>6°<md-tooltip md-direction='top'>12:55 - 13:50</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>7°<md-tooltip md-direction='top'>14:30 - 15:30</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>8°<md-tooltip md-direction='top'>15:30 - 16:30</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>9°<md-tooltip md-direction='top'>16:30 - 17:30</md-tooltip></th>\
                        <th style='border: 0.5px solid white;'>10°<md-tooltip md-direction='top'>17:30 - 18:30</md-tooltip></th>\ ";
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
                        tooltipText = '12:55 - 13:50';
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
                x += "<th style='border: 0.5px solid white;'>"+$scope.sHour+"°<md-tooltip md-direction='top'>"+tooltipText+"</md-tooltip></th>";
            }

            x += "</tr></thead>";
            x += "<tbody>";
            
            for (var key in responses) {
                if (key == "")
                    continue;
                
                if ($scope.sRoom != undefined && $scope.sRoom != 'Qualsiasi') {
                    if ($scope.sRoom == key) {
                        x += "<tr><td style='border: 0.5px solid white;'>" + key + "</td>";
                    }
                } else {
                    x += "<tr><td style='border: 0.5px solid white;'>" + key + "</td>";
                }
                
                responses[key].forEach(function(element) {

                    if ($scope.sRoom != undefined && $scope.sRoom != 'Qualsiasi') {
                        if ($scope.sRoom == element.stanza) {
                            if ($scope.sHour != undefined && $scope.sHour != 'Qualsiasi') {
                                if (element.ora == $scope.sHour) {
                                    if (element.risorsa != null) {
                                        /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                            + 'ng-click="aulaPrenotata()">NP</td>';*/
                                        x += '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>';
                                    } else {
                                        /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                            + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';*/
                                        x += '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';
                                    }
                                }
                            } else {
                                if (element.risorsa != null) {
                                    /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                        + 'ng-click="aulaPrenotata()">NP</td>';*/
                                    x += '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>';
                                } else {
                                    /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                        + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';*/
                                    x += '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';
                                }
                            }
                        }
                    } else {
                        if ($scope.sHour != undefined && $scope.sHour != 'Qualsiasi') {
                            if (element.ora == $scope.sHour) {
                                if (element.risorsa != null) {
                                    /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                        + 'ng-click="aulaPrenotata()">NP</td>';*/
                                    x += '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>';
                                } else {
                                    /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                        + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';*/
                                    x += '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';
                                }
                            }
                        } else {
                            if (element.risorsa != null) {
                                /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                    + 'ng-click="aulaPrenotata()">NP</td>';*/
                                x += '<td ng-click="aulaPrenotata()" style="border: 0.5px solid white;background-color:red; cursor: pointer"></td>';
                            } else {
                                /*x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                    + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';*/
                                x += '<td ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" style="border: 0.5px solid white;background-color:green; cursor: pointer"></td>';
                            }
                        }
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
            $rootScope.prenotazioneString = stanza + ' ' + (ora) + '°ora';
            //$rootScope.sClass = $scope.sClass;
            $mdDialog.show({
                    templateUrl: 'tpl/daydialog/confermaprenotazione.tpl.html',
                    controller: 'ConfermaPrenotazioneCtrl',
                    clickOutsideToClose: true,
                    skipHide: true
            })
        };
        

        /**
         * called by other controllers in order to refresh the 'prenotazioni' table
         */
        $scope.$on("refreshTable", function (event, args) {
            $scope.getPrenotazioni();
        });

        
        /**
         * called by other controllers in order to re-initialize the controller
         */
        $scope.$on("reInit", function (event, args) {
            $scope.reInit(args.day);
        });


        /**
         * shows an alert message if the user clicks on 'ora già prenotata'
         */
        $scope.aulaPrenotata = function(){

            if ($scope.sRoomType == "LABORATORIO"){
                $mdToast.show($mdToast.simple()
                                .textContent('Laboratorio non prenotabile!')
                                .hideDelay(1500)
                                );
            }
            
            if ($scope.sRoomType == "AULA"){
                $mdToast.show($mdToast.simple()
                                .textContent('Aula non prenotabile!')
                                .hideDelay(1500)
                                );
            }

        }

    });