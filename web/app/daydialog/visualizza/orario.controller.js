app.
    controller("OrarioCtrl", function($scope, $filter, $http, $q, $window, $sce, $mdDateLocale) {

        $scope.day;
        $scope.currentItem = '';
        $scope.viewPlani = false;
        $scope.classes = [];
        $scope.isSunday = true;
        $scope.htmlTable = "";
        $scope.all = false;
        $scope.data;
        $scope.type;
        $scope.selected = false;
        

        //$http.get('http://88.149.220.222/orario/api.php', {
        $http.get('http://marconitt.altervista.org/timetable.php', {
            params: {
                search: ""
            }
        }).success(function(response) {
          
            $scope.classes = response.classes;        
            $scope.rooms = response.rooms;
            $scope.teachers = response.teachers;
            $scope.projects = response.projects;

        })


        $scope.init = function(date) {

            $scope.day = new Date(date);
            $scope.isSunday = $scope.day.getDay() == 0;
            $scope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();
            $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona una classe, un insegnante o un'aula</p>";
        }


        /*$scope.getOrarioRoom = function() {
            //alert($scope.giornoSelezionato);
            $scope.sTeacher = undefined;
            $scope.sClass = undefined;
            $scope.currentItem = $scope.sRoom;
            //console.log($scope.sRoom);
            $http.get('http://marconitt.altervista.org/timetable.php', {
                params: {
                    ttroom: $scope.sRoom,
                    date: $scope.giornoSelezionato
                }
            }).success(function(response) {
                console.log("stanza: " +$scope.sRoom);
                console.log("giorno: " +$scope.giornoSelezionato);
                console.log("response: " + response);
                $scope.genTable(response, 'aula');
            })
        }*/

        $scope.getOrarioRoom = function() {

            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sClass = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            $scope.query = "select * from timetable where stanza = '" + $scope.sRoom + "' and\
                            giorno = '" + $scope.giornoSelezionato + "' order by ora";

            $http.get('http://marconitt.altervista.org/timetable.php', {
                cache: false,
                params: {
                    doquery: $scope.query
                }
            }).success(function(response) {
                console.log("stanza: " +$scope.sRoom);
                console.log("giorno: " +$scope.giornoSelezionato);
                console.log("response: " + response);
                $scope.genTest(response, 'aula');
            })
        }
//http://marconitt.altervista.org/timetable.php
//http://88.149.220.222/orario/api.php?room=L247
//http://marconitt.altervista.org/timetable.php?ttroom=L247
//select * from timetable where stanza = 'L247' and giorno = '2017-5-8'

        $scope.getOrarioTeacher = function() {

            $scope.selected = true; 
            $scope.sRoom = undefined; 
            $scope.sClass = undefined;        
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            $scope.query = "select * from timetable where professore1 = '" + $scope.sTeacher + "' or professore2 = '" + $scope.sTeacher + "' and\
                            giorno = '" + $scope.giornoSelezionato + "' order by ora";

            $http.get('http://marconitt.altervista.org/timetable.php', {
                params: {
                    doquery: $scope.query
                }
            }).success(function(response) {
                $scope.genTest(response, 'prof');
            })
        }


        /*$scope.getOrarioClass = function() {
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.currentItem = $scope.sClass;

            $http.get('http://88.149.220.222/orario/api.php', {
                params: {
                    class: $scope.sClass
                }
            }).success(function(response) {
                
                $scope.genTable(response, 'classe');
                
            })
        }*/

        $scope.getOrarioClass = function() {

            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            $scope.query = "select * from timetable where risorsa = '" + $scope.sClass + "' and giorno = '" + $scope.giornoSelezionato + "' order by ora";
            
            $http.get('http://marconitt.altervista.org/timetable.php', {
                cache: false,
                params: {
                    doquery: $scope.query
                }
            }).success(function(response) {
                console.log("classe: " +$scope.sClass);
                console.log("giorno: " +$scope.giornoSelezionato);
                console.log("response: " + response);
                $scope.genTest(response, 'classe');
            })
        }


        /*$scope.legend = function() {
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.sClass = undefined;
            $scope.currentItem = "Legenda";
            $http.get('http://88.149.220.222/orario/api.php', {
                params: {
                    legend: ''
                }
            }).success(function(response) {
                $scope.genLegend(response);
            })
        }


        $scope.genLegend = function(data) {
            var x = "<h3>Legenda sorveglianze</h3><table class=\"table\">\
                    <thead><tr>\
                        <th>Sigla</th>\
                        <th>Descrizione</th>\
                    </tr></thead><tbody>";
            data.forEach(function(a) {
                //console.log(a);
                x += "<tr>\
                        <td>" + a.sigla + "</td>\
                        <td>" + a.nome + "</td>\
                    </tr>";
            });

            x += "</tbody></table>";
            $scope.htmlTable = x;
        }


        $scope.plani = function(data) {
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.sClass = undefined;
            $http
                .get('/tpl/planimetrie.tpl.html')
                .success(function(res) {
                    $scope.htmlTable = res;
                    //console.log(res);
                });

        }


        $scope.viewAll = function() {
            if ($scope.sTeacher != undefined) $scope.getOrarioTeacher();
            if ($scope.sClass != undefined) $scope.getOrarioClass();
            if ($scope.sRoom != undefined) $scope.getOrarioRoom();
        }

*/
        $scope.genTest = function(data, tipo) {
            var days = $mdDateLocale.days;

            if (tipo == 'aula'){
            //alert("AULA");
            var x = "<table class=\"table\">\
                    <thead><tr>\
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
                    </tr></thead>\
                    <tbody>";

                    data.forEach(function(a) {

                    if (a.risorsa == null) {
                        x += "<td>&nbsp;</td>";
                    }else if(a.professore2 == null && a.professoreS == null && a.professore1 != null){
                        x += "<td><span class='nome'>" + a.professore1.toLowerCase() + "</span><br>" + a.risorsa + " </td>";
                    }else if(a.professore1 == null && a.professore2 == null && a.professoreS == null){
                        x += "<td>" + a.risorsa + " </td>";
                    }else if(a.professore2 == null && a.professoreS == null && a.professore1 != null){
                        x += "<td><span class='nome'>" + a.professore1.toLowerCase() + "</span><br>" + a.risorsa + " </td>";
                    }else if(a.professoreS == null && a.professore1 != null && a.professore2 != null){
                        x += "<td><span class='nome'>" + a.professore1.toLowerCase() +"<br>" + a.professore2.toLowerCase() + "</span><br>" + a.risorsa + " </td>";
                    }else{
                        x += "<td><span class='nome'>" + a.professore1.toLowerCase() + "<br>" + a.professore2.toLowerCase() + "<br>" + a.professoreS.toLowerCase() + "</span><br>" + a.risorsa + " </td>";
                    }
                    });
                
            

            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;


            }else if(tipo == 'classe'){
            //alert("CLASSE");
               var x = "<table class=\"table\">\
                        <thead><tr>\
                        <th>1</th>\
                        <th>2</th>\
                        <th>3</th>\
                        <th>4</th>\
                        <th>5</th>\
                        <th>6</th>\
                    </tr></thead>\
                    <tbody>";

            for (var i = 0; i < 6; i++) {

                try{


                    if (data[i].risorsa == undefined){
                        x += "<td>&nbsp;</td>";
                    }else if (data[i].professore2 == null && data[i].professoreS == null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }else if (data[i].professoreS == null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }else if (data[i].professore1 == null && data[i].professore2 != null && data[i].professoreS != null){
                        x += "<td><span class='nome'>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }

                }catch(e){
                    x += "<td>&nbsp;</td>";
                }

            }
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;

            }else if(tipo == 'prof'){
            //alert("CLASSE");
               var x = "<table class=\"table\">\
                        <thead><tr>\
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
                    </tr></thead>\
                    <tbody>";

            for (var i = 0; i < 10; i++) {

                /*try{

                    if (data[i].risorsa == undefined){
                        x += "<td>&nbsp;</td>";
                    }else if (data[i].professore2 == null && data[i].professoreS == null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].risorsa + "<br>" + data[i].stanza + "</td>";
                    }else if (data[i].professoreS == null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }else if (data[i].professore1 == null && data[i].professore2 != null && data[i].professoreS != null){
                        x += "<td><span class='nome'>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }

                }catch(e){
                    x += "<td>&nbsp;</td>";
                }*/
 
                try{

                    if (data[i].stanza != null && data[i].risorsa != null){

                            if (data[i].professoreS == null && data[i].professore2 == null && data[i].professore1 != null){
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].risorsa + " " + data[i].stanza + "</td>";
                                
                            }else if (data[i].professoreS == null && data[i].professore2 != null && data[i].professore1 != null){    
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].risorsa + " " + data[i].stanza + "</td>";
                                
                            }else if (data[i].professoreS != null && data[i].professore2 != null && data[i].professore1 != null){
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + " " + data[i].stanza + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 != null && data[i].professore1 == null){
                                x += "<td><span class='nome'>"+ data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + " " + data[i].stanza + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 == null && data[i].professore1 == null){
                                x += "<td><span class='nome'>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + " " + data[i].stanza + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 == null && data[i].professore1 != null){
                                x += "<td><span class='nome'>"+ data[i].professore1.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + " " + data[i].stanza + "</td>";
                            }

                        }else if (data[i].stanza != null && data[i].risorsa == null){

                            if (data[i].professoreS == null && data[i].professore2 == null && data[i].professore1 != null){
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                                
                            }else if (data[i].professoreS == null && data[i].professore2 != null && data[i].professore1 != null){    
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                                
                            }else if (data[i].professoreS != null && data[i].professore2 != null && data[i].professore1 != null){
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 != null && data[i].professore1 == null){
                                x += "<td><span class='nome'>"+ data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 == null && data[i].professore1 == null){
                                x += "<td><span class='nome'>"+ data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 == null && data[i].professore1 != null){
                                x += "<td><span class='nome'>"+ data[i].professore1.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                            }

                        }else if (data[i].stanza == null && data[i].risorsa != null){

                            if (data[i].professoreS == null && data[i].professore2 == null && data[i].professore1 != null){
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].risorsa + "</td>";
                                
                            }else if (data[i].professoreS == null && data[i].professore2 != null && data[i].professore1 != null){    
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].risorsa + "</td>";
                                
                            }else if (data[i].professoreS != null && data[i].professore2 != null && data[i].professore1 != null){
                                x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 != null && data[i].professore1 == null){
                                x += "<td><span class='nome'>"+ data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 == null && data[i].professore1 == null){
                                x += "<td><span class='nome'>"+ data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + "</td>";
                            
                            }else if (data[i].professoreS != null && data[i].professore2 == null && data[i].professore1 != null){
                                x += "<td><span class='nome'>"+ data[i].professore1.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + "</td>";
                            }
                        }    
                
                    }catch(e){
                        
                        x += "<td>&nbsp;</td>";
                    }

            }
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
            }
        };
    });
        
            /*
        $scope.genTable = function(data, tipo) {
            var days = $mdDateLocale.days;
            m = [
                [],
                [],
                [],
                [],
                [],
                []
            ];

            if (tipo == "prof") {
                var x = "<table class=\"table\">\
                    <thead><tr>\
                        <th>&nbsp;</th>\
                        <th>1</th>\
                        <th>2</th>\
                        <th class=\"sorv\">I</th>\
                        <th>3</th>\
                        <th>4</th>\
                        <th class=\"sorv\">II</th>\
                        <th>5</th>\
                        <th>6</th>\
                    </tr></thead>";
            } else {
                var x = "<table class=\"table\">\
                    <thead><tr>\
                        <th>&nbsp;</th>\
                        <th>1</th>\
                        <th>2</th>\
                        <th>3</th>\
                        <th>4</th>\
                        <th>5</th>\
                        <th>6</th>\
                    </tr></thead>";
            }

            data.forEach(function(a) {
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

            x += "<tbody>";


            if (tipo == "prof") {
                for (var i = 0; i <= 5; i++) {
                    if ($scope.all || i == $scope.day.getDay()-1) {
                        x += "<tr><td>" + days[i+1] + "</td>";
                        for (var j = 0; j <= 7; j++) {
                            cella = m[i][j];
                            try {
                                if (cella.classe == null) {
                                    x += "<td class=\"sorv\">" + cella.aula + "</td>";
                                } else {
                                    x += "<td>" + cella.aula + " " + cella.materia + " " + cella.classe + "</td>";
                                }
                                //console.log(cella);
                            } catch (e) {
                                x += "<td>&nbsp;</td>";
                            }
                        }
                        x += "</tr>";
                    }
                };

            } else {
                for (var i = 0; i <= 5; i++) {
                    if ($scope.all || i == $scope.day.getDay()-1) {
                        x += "<tr><td>" + days[i+1] + "</td>";
                        for (var j = 0; j <= 5; j++) {
                            cella = m[i][j];
                            if (tipo == "classe") {
                                try {
                                    x += "<td>" + cella.aula + " " + cella.materia + "<br><span class='nome'>" + cella.prof.toLowerCase() + "</span></td>";
                                    //console.log(cella);
                                } catch (e) {
                                    x += "<td>&nbsp;</td>";
                                }
                            }
                            if (tipo == "aula") {
                                try {
                                    x += "<td><span class='nome'>" + cella.prof.toLowerCase() + "</span><br>" + cella.materia + " " + cella.classe + "</td>";
                                    //console.log(cella);
                                } catch (e) {
                                    x += "<td>&nbsp;</td>";
                                }
                            }
                        }
                        x += "</tr>";
                    }
                };
            }

            //console.log(m);

            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
        }*/
    
    //});