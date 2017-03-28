app.
    controller("PrenotazioneCtrl", function($scope, $filter, $http, $q, $window, $sce, $mdDateLocale, CONFIG, $mdDialog, $mdToast, $rootScope) {
        
        $scope.day;
        $scope.currentItem = '';
        $scope.classes = [];
        $scope.isSunday = true;
        $scope.htmlTable = "";
        $scope.all = false;
        $scope.prenotazioneString = $rootScope.prenotazioneString;


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
            //console.log(date);
            $scope.day = new Date(date);
            $rootScope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1)
                + "-" + $scope.day.getDate();
            $scope.isSunday = $scope.day.getDay() == 0;
            $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
        }


        $scope.getPrenotazioni = function() {
            //console.log("****");
            if ($scope.sRoomType == "LABORATORIO") {
                console.log("****");
                //$http.get('http://88.149.220.222/orario/api3.php', {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                //$http.get('http://localhost/timetable.php', {
                        params: {
                            labroomsbydate: $rootScope.giornoSelezionato
                        }
                }).success(function(response) {
                    $scope.genTable2(response.rooms);
                });

            } else if ($scope.sRoomType == "AULA") {
                //$http.get('http://88.149.220.222/orario/api3.php', {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                //$http.get('http://localhost/timetable.php', {
                        params: {
                            classroomsbydate: $rootScope.giornoSelezionato
                        }
                }).success(function(response) {
                    $scope.genTable2(response.rooms);
                });
            }
        };


        $scope.genTable2 = function(responses) {
            console.log(responses);
            console.log("########");
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
                        x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;background-color:red"'
                             + '>NP</td>';
                    } else {
                        x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;"'
                             + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
                    }
                    
                }, this);
                x += "</tr>";
            }

            x += "</tbody>";
            x += "</table>";
            //console.log(x);
            $scope.htmlTable = x;
        };


        $scope.genTable = function(responses) {
            var days = $mdDateLocale.days;
            
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
                    </tr></thead>";
            
            x += "<tbody>";

            for (var key in responses) { //ad ogni array di oggetto 
                m = [ [], [], [], [], [], [], [], [], [] ];

                responses[key].forEach(function(a) {
                    //console.log(a.pren);
                    if (m[a.giorno - 1][a.ora - 1] != undefined) {
                        try {
                            if (m[a.giorno - 1][a.ora - 1].concorso == "sos" || m[a.giorno - 1][a.ora - 1].concorso[0] == "C") {
                                m[a.giorno - 1][a.ora - 1].prof = a.prof + " " + m[a.giorno - 1][a.ora - 1].prof;
                            } else {
                                m[a.giorno - 1][a.ora - 1].prof += " " + a.prof;
                            }
                        } catch (h) {
                            m[a.giorno - 1][a.ora - 1].prof += " " + a.prof;
                        }
                    } else {
                        m[a.giorno - 1][a.ora - 1] = a;
                    }
                });        

                for (var i = 0; i <= 8; i++) {
                    if (i == $scope.day.getDay()-1) {
                        x += "<tr><td>" + key + "</td>";
                        for (var j = 0; j <= 8; j++) {
                            cella = m[i][j];
                            //console.log("cella:" + cella);
                            try {
                                if (cella.pren == 'true') {
                                    x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;background-color:green"'
                                    + '>NP</td>';
                                } else {
                                //x += "<td><span class='nome'>" + cella.prof.toLowerCase() + "</span><br>" + " " + cella.classe + "</td>";
                                exceptionTester = cella.classe;
                                exceptionTester = cella.prof;
                                x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;background-color:red"'
                                    + '>NP</td>';}
                                //console.log(cella);
                            } catch (e) {
                                //x += '<td style="background-color:blue;"> </td>';
                                x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;"'
                                    + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (j) + ')" >P</td>';
                            }
                        }
                        x += "</tr>";
                    }
                };                 
            }            
            
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
        }


        $scope.prenotaClick = function(stanza, ora) {
            $rootScope.stanzaPrenotata = stanza;
            $rootScope.oraPrenotata = ora;
            $rootScope.prenotazioneString = stanza + ' ' + (ora) + '°ora';
            $rootScope.sRoomType = $scope.sRoomType;
            $mdDialog.show({
                    templateUrl: 'tpl/dialogConfermaPrenotazione.tpl.html',
                    controller: 'ConfermaPrenotazioneCtrl',
                    clickOutsideToClose: true,
                    skipHide: true
            })
        };

        $rootScope.$on("getPrenotazioni", function() {
            $scope.sRoomType = $rootScope.sRoomType;
            $scope.getPrenotazioni();
        });

        $scope.$on("refreshEvent", function (event, args) {
            $scope.sRoomType = $rootScope.sRoomType;
            $scope.getPrenotazioni();
        });

    });
