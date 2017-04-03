app.
    controller("PrenotazioneCtrl", function($scope, $http, $window, $mdDialog, $mdToast, $rootScope) {
     
        $scope.day;
        $scope.currentItem = '';
        $scope.classes = [];
        $scope.isSunday = true;
        $scope.htmlTable = ""; // 'prenotazioni' table html code
        $scope.all = false;
        $scope.admin = $rootScope.admin; // is protocollo or not
        $scope.loading; // boolean for showing loading circle
        $scope.classes; // list of classes
        $scope.teachers; // list of teachers
        $scope.rooms; // list of rooms
        $scope.classrooms; // list of classrooms
        $scope.labs; // list of laboratories
        $scope.sRoomType; // type of selected room (lab or classroom)
        $scope.sRoom; // selected room
        $scope.sHour; // selected hour
        giorniLimite = 14; // range in cui un prof può effettuare una prenotazione


        /**
         * initialize method
         */
        $scope.init = function(date) {
            $scope.day = new Date(date);
            var limitDay = new Date();
            limitDay.setDate(limitDay.getDate() + giorniLimite);
            if ($scope.day > limitDay && !$rootScope.admin) {
                $scope.htmlTable = "Seleziona una data più vicina!";
            } else {
                $scope.initializeHttpCalls();
                $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1)
                    + "-" + $scope.day.getDate();
                $scope.isSunday = $scope.day.getDay() == 0;
                $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
            }
        }


        /**
         * makes http requests to populate classes, rooms, teachers, labs and classrooms arrays
         */
        $scope.initializeHttpCalls = function() {
            $http.get('http://marconitt.altervista.org/timetable.php').success(function(response) {
                $scope.classes = response.classes;
                $scope.rooms = response.rooms;
                $scope.teachers = response.teachers;
                $scope.classrooms = response.classrooms;
                $scope.labs = response.labs;
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
            } else if($scope.sRoomType == undefined || $scope.loading) {
                $scope.htmlTable = "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
            } else {
                $scope.getPrenotazioni();
            }
        }


        /**
         * calls timetable API and pass the response to genTable() method
         */
        $scope.getPrenotazioni = function() {
            $scope.htmlTable = '';
            $scope.loading = true;
            if ($scope.sRoomType == "LABORATORIO") {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                    cache: false,
                    params: {
                        labroomsbydate: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {
                    $scope.genTable(response.rooms);
                    $scope.loading = false;
                });
                $scope.dim(); //for scrollbar

            } else if ($scope.sRoomType == "AULA") {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                    cache: false,
                    params: {
                        classroomsbydate: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {
                    $scope.genTable(response.rooms);
                    $scope.loading = false;
                    $scope.dim(); //for scrollbar (leo)
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

            var x = "<table class=\"table\">\
                    <thead><tr>\
                        <th>&nbsp;</th>\ ";
                        
            if ($scope.sHour == undefined || $scope.sHour == 'Qualsiasi') {
                x += "<th>1</th>\
                        <th>2</th>\
                        <th>3</th>\
                        <th>4</th>\
                        <th>5</th>\
                        <th>6</th>\
                        <th>7</th>\
                        <th>8</th>\
                        <th>9</th>\
                        <th>10</th>\ ";
            } else {
                x += "<th>" + $scope.sHour + "</th>";
            }

            x += "</tr></thead>";
            x += "<tbody>";
            
            for (var key in responses) {
                if (key == "")
                    continue;
                
                if ($scope.sRoom != undefined && $scope.sRoom != 'Qualsiasi') {
                    if ($scope.sRoom == key) {
                        x += "<tr><td>" + key + "</td>";
                    }
                } else {
                    x += "<tr><td>" + key + "</td>";
                }
                
                responses[key].forEach(function(element) {

                    if ($scope.sRoom != undefined && $scope.sRoom != 'Qualsiasi') {
                        if ($scope.sRoom == element.stanza) {
                            if ($scope.sHour != undefined && $scope.sHour != 'Qualsiasi') {
                                if (element.ora == $scope.sHour) {
                                    if (element.risorsa != null) {
                                        x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                            + 'ng-click="aulaPrenotata()">NP</td>';
                                    } else {
                                        x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                            + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
                                    }
                                }
                            } else {
                                if (element.risorsa != null) {
                                    x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                        + 'ng-click="aulaPrenotata()">NP</td>';
                                } else {
                                    x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                        + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
                                }
                            }
                        }
                    } else {
                        if ($scope.sHour != undefined && $scope.sHour != 'Qualsiasi') {
                            if (element.ora == $scope.sHour) {
                                if (element.risorsa != null) {
                                    x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                        + 'ng-click="aulaPrenotata()">NP</td>';
                                } else {
                                    x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                        + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
                                }
                            }
                        } else {
                            if (element.risorsa != null) {
                                x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                                    + 'ng-click="aulaPrenotata()">NP</td>';
                            } else {
                                x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                                    + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
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