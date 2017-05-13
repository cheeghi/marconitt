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
        $http.get('http://localhost/timetable.php', {
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


            $scope.sem1 = false;
            $scope.sem2 = false;
            $scope.sem3 = false;
            $scope.day = new Date(date);
            $scope.isSunday = $scope.day.getDay() == 0;
            $scope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();
            $scope.htmlTable = ($scope.isSunday) ? "<p>Non c'è scuola di domenica</p>" : "<p>Seleziona una classe, un insegnante o un'aula</p>";
        }


        /**
         * called by other controllers in order to re-initialize the controller
         */
        $scope.$on("reInitVisualizza", function (event, args) {
            $scope.init(args.day);
            if(! $scope.isSunday){
                if ($scope.sClass != undefined){
                    $scope.getOrarioClass($scope.sClass);
                }else if($scope.sTeacher != undefined){
                    $scope.getOrarioTeacher($scope.sTeacher);
                }else if($scope.sRoom != undefined){
                     $scope.getOrarioRoom($scope.sRoom);
                }
            }
        });

        $scope.getOrarioRoom = function() {

            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sClass = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            $scope.query = "select * from timetable where stanza = '" + $scope.sRoom + "' and\
                            giorno = '" + $scope.giornoSelezionato + "' order by ora";
            $http.get('http://localhost/timetable.php', {
                cache: false,
                params: {
                    doquery: $scope.query
                }
            }).success(function(response) {
                console.log("stanza: " +$scope.sRoom);
                console.log("giorno: " +$scope.giornoSelezionato);
                console.log("response: " + response);


                $scope.genTable(response, 'aula');
                
            });
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
            $scope.query = "select * from timetable where (professore1 = '" + $scope.sTeacher + "' or professore2 = '" + $scope.sTeacher + "' or professoreS = '" + $scope.sTeacher + "') and\
                            giorno = '" + $scope.giornoSelezionato + "' order by ora";

            $http.get('http://localhost/timetable.php', {
                params: {
                    doquery: $scope.query
                }
            }).success(function(response) {
                $scope.genTable(response, 'prof');
            })
        }

        $scope.getOrarioClass = function() {

            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            
            var orarioClass = {};

            $scope.queryLiberazione = "select liberazione.descrizione, prof_liberazione.professori, prof_liberazione.ora from liberazione inner join prof_liberazione on\
             liberazione.id = prof_liberazione.liberazione where liberazione.classe = '" + $scope.sClass + "' and giorno = '" + $scope.giornoSelezionato + "' order by ora";
            $scope.queryTimetable = "select * from timetable where risorsa = '" + $scope.sClass + "' and giorno = '" + $scope.giornoSelezionato + "' order by ora";
            $scope.queryEventi = "select eventi.descrizione, eventi.stanze, prof_eventi.ora, prof_eventi.professori from eventi inner join prof_eventi\
            on eventi.id = prof_eventi.id where eventi.giorno = '" + $scope.giornoSelezionato + "' and eventi.classi like '%" + $scope.sClass + "%' order by oraInizio;"

            $http.get('http://localhost/timetable.php', {
                cache: false,
                params: {
                    doquery: $scope.queryLiberazione
                }
            }).success(function(response) {

                response.forEach (function (response){
                    orarioClass[response.ora] = response;
                });      

                $http.get('http://localhost/timetable.php', {
                    cache: false,
                    params: {
                        doquery: $scope.queryTimetable
                    }
                }).success(function(response2) {
                    response2.forEach (function (response2){
                        orarioClass[response2.ora] = response2;
                    });

                $http.get('http://localhost/timetable.php', {
                        cache: false,
                        params: {
                            doquery: $scope.queryEventi
                        }
                    }).success(function(response3) {
                        response3.forEach (function (response3){
                            orarioClass[response3.ora] = response3;
                        });
                        
                    console.log("orarioClass dopo orario(completo): " + JSON.stringify(orarioClass));
                    $scope.genTest(orarioClass, 'classe');
                    })    
                })
            })
        }

        /*$scope.getOrarioClass = function() {

            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            $scope.query = "select * from timetable where risorsa = '" + $scope.sClass + "' and giorno = '" + $scope.giornoSelezionato + "' order by ora";
            
            $http.get('http://localhost/timetable.php', {
                cache: false,
                params: {
                    doquery: $scope.query
                }
            }).success(function(response) {
                console.log("classe: " +$scope.sClass);
                console.log("giorno: " +$scope.giornoSelezionato);
                console.log("response: " + response);
                $scope.genTable(response, 'classe');
            })
        }*/

        $scope.genTest = function(data, tipo) {
            var days = $mdDateLocale.days;

            if (tipo == 'classe'){

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

            for (var i = 1; i <= 10; i++) {

                try{
                   
                    if (data[i].descrizione != undefined && data[i].stanze != undefined){
                        
                        x += "<td>" + data[i].descrizione.toLowerCase()  + "<br>" + data[i].professori.toLowerCase() + "<br>" + data[i].stanze + "</td>";

                    }else if(data[i].descrizione != undefined && data[i].stanze == undefined){
                        x += "<td>" + data[i].descrizione.toLowerCase()  + "</td>";

                    }else{

                        if (data[i].risorsa == undefined || data[i].risorsa == null){
                            x += "<td>&nbsp;</td>";
                        }else if (data[i].professore2 == null && data[i].professoreS == null){
                            x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                        }else if (data[i].professoreS == null && data[i].professore2 != null){
                            x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                        }else if (data[i].professore1 == null && data[i].professore2 != null && data[i].professoreS != null){
                            x += "<td><span class='nome'>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
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
    }

        

        $scope.genTable = function(data, tipo) {
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
                        <th>7</th>\
                        <th>8</th>\
                        <th>9</th>\
                        <th>10</th>\
                    </tr></thead>\
                    <tbody>";


            for (var i = 0; i < 10; i++) {

                try{

                    console.log(i + ":" + data[i].risorsa);
                    if (data[i].risorsa == undefined || data[i].risorsa == null){
                        x += "<td>&nbsp;</td>";
                    }else if (data[i].professore2 == null && data[i].professoreS == null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }else if (data[i].professoreS == null && data[i].professore2 != null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }else if (data[i].professore1 == null && data[i].professore2 != null && data[i].professoreS != null){
                        x += "<td><span class='nome'>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                    }

                }catch(e){
                    console.log(i + ": null");
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

                try{

                    if (data[i].stanza != null && data[i].risorsa != null){
                        x += "<td>" + data[i].risorsa + "<br>" + data[i].stanza + "</td>";

                    }else if (data[i].stanza != null && data[i].risorsa == null){
                        x += "<td>" + data[i].stanza + "</td>";

                    }else if (data[i].stanza == null && data[i].risorsa != null){
                        x += "<td>" + data[i].risorsa + "</td>";
                    }
                }catch(e){

                     x += "<td>&nbsp;</td>";
                }

/*
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
                }*/
            }
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
            }
        };
    });

