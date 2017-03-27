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
            $rootScope.giornoPrenotato = $scope.day;
            $scope.isSunday = $scope.day.getDay() == 0;
            $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona se vuoi prenotare un laboratorio o un'aula</p>";
        }


        $scope.getPrenotazioni = function() {
            if ($scope.sRoomType == "LABORATORIO") {
                //$http.get('http://88.149.220.222/orario/api3.php', {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                //$http.get('http://localhost/timetable.php', {
                        params: {
                            labroomsbydate: "2017-06-09"
                        }
                }).success(function(response) {
                    $scope.genTable2(response.rooms);
                });

            } else if ($scope.sRoomType == "AULA") {
                //$http.get('http://88.149.220.222/orario/api3.php', {
                $http.get('http://marconitt.altervista.org/timetable.php', {
                //$http.get('http://localhost/timetable.php', {
                        params: {
                            classroomsbydate: "2017-06-09"
                        }
                }).success(function(response) {
                    $scope.genTable2(response.rooms);
                });
            }
        };


        $scope.genTable2 = function(responses) {

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
                
                //m = [ [], [], [], [], [], [], [], [], [] ];
                
                x += "<tr><td>" + key + "</td>";
                responses[key].forEach(function(element) {
                    //m[element.ora - 1] = element;
                    console.log(element.risorsa);
                    if (element.risorsa != "Null") {
                        //x += "<td>" + element.aula +  ";" + element.ora + "</td>";
                        //x += "<td>" + element.classe + "</td>";
                        x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;background-color:red"'
                             + '>NP</td>';
                    } else {
                        //x += "<td></td>";
                        x += '<td><md-button class="md-raised md-primary" style="max-width:30px;min-width:30px;max-height:35px;min-height:35px;"'
                             + 'ng-click="prenotaClick(\'' + key + '\'' + ',' + (element.ora) + ')" >P</td>';
                    }
                    
                }, this);
                x += "</tr>";
            }

            x += "</tbody>";
            x += "</table>";
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


        $scope.prenotaClick = function(lab, ora) {
            $rootScope.labPrenotato = lab;
            $rootScope.oraPrenotata = ora;
            $rootScope.prenotazioneString = lab + ' ' + (ora) + '°ora';
            $mdDialog.show({
                    templateUrl: 'tpl/dialogConfermaPrenotazione.tpl.html',
                    controller: 'PrenotazioneCtrl',
                    clickOutsideToClose: true,
                    skipHide: true
            })
        };


        $scope.cancel = function() {
            $mdDialog.cancel();
        };


        $scope.prenota = function() {
            /*console.log("lab prenotato:" + $rootScope.labPrenotato);
            console.log("ora prenotato:" + $rootScope.oraPrenotata);
            console.log("giorno prenotato:" + $rootScope.giornoPrenotato);*/
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/prenota',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "token="+$rootScope.token+"&lab="+$rootScope.labPrenotato+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoPrenotato
            };

            $http(req)
                .then(
                    function(data) {
                        console.log(data);
                    }
                );

            $scope.cancel();
            $mdToast.show($mdToast.simple().textContent('Prenotazione avvenuta con successo!'));
        };

    });
