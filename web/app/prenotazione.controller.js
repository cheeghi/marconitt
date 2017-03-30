app.
    controller("PrenotazioneCtrl", function($scope, $http, $window, $mdDialog, $rootScope) {
     
        $scope.day;
        $scope.currentItem = '';
        $scope.classes = [];
        $scope.isSunday = true;
        $scope.htmlTable = "";
        $scope.all = false;
        $scope.admin = $rootScope.admin;
        $scope.loading;

        $http.get('http://88.149.220.222/orario/api.php', {  
            params: {
                search: ""
            }
        }).success(function(response) {
            $scope.classes = response.classes;
            $scope.rooms = response.rooms;
            $scope.teachers = response.teachers;
        });


        $scope.init = function(date) {
            $scope.day = new Date(date);
            $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1)
                + "-" + $scope.day.getDate();
            $scope.isSunday = $scope.day.getDay() == 0;
            $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
        }

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

            } else if ($scope.sRoomType == "AULA") {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                    cache: false,
                    params: {
                        classroomsbydate: $rootScope.giornoSelezionato
                    }
                }).success(function(response) {

                    $scope.genTable(response.rooms);
                    $scope.loading = false;
                   
                });
            }
        };


        $scope.genTable = function(responses) {

            var x = "<table class=\"table\">\
                    <thead><tr>\
                        <th>&nbsp;</th>\
                        <th>1</th>\
                        <th>2</th>\
                        <th>3</th>\
                        <th>4</th>\
                        <th>5</th>\
                        <th>6</th>\
                        <th>7</th>\
                        <th>8</th>\
                        <th>9</th>\
                        <th>10</th>\
                    </tr></thead>";
            
            x += "<tbody>";

            for (var key in responses) {
                if (key == "")
                    continue;
                
                x += "<tr><td>" + key + "</td>";
                responses[key].forEach(function(element) {
                    if (element.risorsa != null) {
                        x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_np"'
                             + '>NP</td>';
                    } else {
                        x += '<td><md-button class="md-raised md-primary button_prenotazione" id="button_p"'
                             + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
                    }
                    
                }, this);
                x += "</tr>";
            }

            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
        };


        $scope.prenotaClick = function(stanza, ora) {
            $rootScope.stanzaPrenotata = stanza;
            $rootScope.oraPrenotata = ora;
            $rootScope.prenotazioneString = stanza + ' ' + (ora) + '°ora';
            $rootScope.sClass = $scope.sClass;
            $mdDialog.show({
                    templateUrl: 'tpl/dialogConfermaPrenotazione.tpl.html',
                    controller: 'ConfermaPrenotazioneCtrl',
                    clickOutsideToClose: true,
                    skipHide: true
            })
        };
        

        $scope.$on("refreshTable", function (event, args) {
            $scope.getPrenotazioni();
        });

        
        $scope.$on("reInit", function (event, args) {
            $scope.reInit(args.day);
        });


    });