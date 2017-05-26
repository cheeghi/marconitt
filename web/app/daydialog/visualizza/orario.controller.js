app.
    controller("OrarioCtrl", function($scope, $filter, $http, $q, $window, $sce, $mdDateLocale, CONFIG) {

        $scope.day;
        $scope.currentItem = '';
        $scope.classes = [];
        $scope.isHoliday = true;
        $scope.htmlTable = "";
        $scope.all = false;
        $scope.data;
        $scope.type;
        $scope.selected = false;
        

        /**
        * chiamata per riempire gli md-select in HTML
        */
        $http.get ("http://" + CONFIG.TIMETABLE, {
            params: {
                search: ""
            }
        }).success (function(response) {
            $scope.classes = response.classes;        
            $scope.rooms = response.rooms;
            $scope.teachers = response.teachers;
            $scope.projects = response.projects;
        })


        /**
        * chiamata per iniziallizare il controller, il giorno e stabilire se c'è scuola
        */
        $scope.init = function(date) {
            $scope.day = new Date(date);
            $scope.giornoSelezionato = $scope.day.getFullYear() + "-" + ($scope.day.getMonth() + 1) + "-" + $scope.day.getDate();
            
            $http.get ('http://'+CONFIG.TIMETABLE, {
                    cache: false,
                    params: {
                        isholiday: $scope.giornoSelezionato
                    }

                }).success (function(response) {
                    response = response.replace(/\s/g, '');
                    $scope.isHoliday = response == 'true';
                    $scope.htmlTable = ($scope.isHoliday) ? "<p>Non c'è scuola oggi, prenditi una pausa!</p>" : "";

                    if (!$scope.isHoliday){
                        if ($scope.sClass != undefined){
                            $scope.getOrarioClass($scope.sClass);
                        } else if ($scope.sTeacher != undefined){
                            $scope.getOrarioTeacher($scope.sTeacher);
                        } else if ($scope.sRoom != undefined){
                             $scope.getOrarioRoom($scope.sRoom);
                        }
                    }                
                
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                });            
        }


        /**
         * funzione per ri-inizializzare il controller
         */
        $scope.$on("reInitVisualizza", function (event, args) {
            $scope.init(args.day);

            if (!$scope.isHoliday){

                if ($scope.sClass != undefined){
                    $scope.getOrarioClass($scope.sClass);
                } else if ($scope.sTeacher != undefined){
                    $scope.getOrarioTeacher($scope.sTeacher);
                } else if ($scope.sRoom != undefined){
                    $scope.getOrarioRoom($scope.sRoom);
                }
            }
        });


        /**
        * chiamata per ottenere l'orario di una stanza una volta premuta dall' md-select
        */
        $scope.getOrarioRoom = function() {
            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sClass = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            $http.get ("http://" + CONFIG.TIMETABLE, {
                cache: false,
                params: {
                    ttroombyday: '',
                    stanza: $scope.sRoom,
                    day: $scope.giornoSelezionato
                }
            }).success (function(response) {

            $scope.genTable(response, 'aula');
                
            });
        }


        /**
        * chiamata per ottenere l'orario di un professore una volta premuto dall' md-select
        */
        $scope.getOrarioTeacher = function() {
            $scope.selected = true; 
            $scope.sRoom = undefined; 
            $scope.sClass = undefined;        
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';

            var orarioTeacher = {};
            $http.get ("http://" + CONFIG.TIMETABLE, {
                cache: false,
                params: {
                    ttteacherbyday: '',
                    prof: $scope.sTeacher,
                    day: $scope.giornoSelezionato
                }
            }).success (function(response) {

                response.forEach (function (response){
                    orarioTeacher[response.ora] = response;
                });

                $http.get ("http://" + CONFIG.TIMETABLE, {
                        cache: false,
                        params: {
                            teachereventsbyday: '',
                            prof: $scope.sTeacher,
                            day: $scope.giornoSelezionato
                        }
                    }).success (function(response2) {

                        response2.forEach (function (response2){
                            orarioTeacher[response2.ora] = response2;                
                        });

                        $scope.genTable(orarioTeacher, 'prof');
                    }) 
            })
        }


        /**
        * chiamata per ottenere l'orario di una classe una volta premuta dall' md-select
        */
        $scope.getOrarioClass = function() {

            $scope.selected = true;
            $scope.sTeacher = undefined;
            $scope.sRoom = undefined;
            $scope.htmlTable = '<p><div layout="row" layout-sm="column" layout-align="center center" layout-fill>\
                                <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>\
                                </div></p>';
            var orarioClass = {};

            $http.get ("http://" + CONFIG.TIMETABLE, {
                cache: false,
                params: {
                    liberazioniclassbyday: '',
                    classe: $scope.sClass,
                    day: $scope.giornoSelezionato
                }
            }).success (function(response) {

                response.forEach (function (response){
                    orarioClass[response.ora] = response;
                });      

                $http.get ("http://" + CONFIG.TIMETABLE, {
                    cache: false,
                    params: {
                        ttclassbyday: '',
                        classe: $scope.sClass,
                        day: $scope.giornoSelezionato
                    }
                }).success (function(response2) {

                    response2.forEach (function (response2){
                        orarioClass[response2.ora] = response2;
                    });

                $http.get ("http://" + CONFIG.TIMETABLE, {
                        cache: false,
                        params: {
                            classeventsbyday: '',
                            classe: $scope.sClass,
                            day: $scope.giornoSelezionato
                        }
                    }).success (function(response3) {

                        response3.forEach (function (response3){
                            orarioClass[response3.ora] = response3;
                        });
                        
                    $scope.genTable(orarioClass, 'classe');
                    })    
                })
            })
        }


        /**
        * chiamata per generare la tabella html dell'orario prendendo in input gli orari dei diversi tipi di elementi
        */
        $scope.genTable = function(data, tipo) {
            var days = $mdDateLocale.days;
            if (tipo == 'classe'){
            var x = "<table class=\"table\">\
                    <thead><tr>\
                        <th>1°<md-tooltip md-direction='top'>8:00 - 9:00</md-tooltip></th>\
                        <th>2°<md-tooltip md-direction='top'>9:00 - 9:50</md-tooltip></th>\
                        <th>3°<md-tooltip md-direction='top'>10:00 - 11:00</md-tooltip></th>\
                        <th>4°<md-tooltip md-direction='top'>11:00 - 11:50</md-tooltip></th>\
                        <th>5°<md-tooltip md-direction='top'>12:00 - 12:55</md-tooltip></th>\
                        <th>6°<md-tooltip md-direction='top'>12:55 - 14:30</md-tooltip></th>\
                        <th>7°<md-tooltip md-direction='top'>14:30 - 15:30</md-tooltip></th>\
                        <th>8°<md-tooltip md-direction='top'>15:30 - 16:30</md-tooltip></th>\
                        <th>9°<md-tooltip md-direction='top'>16:30 - 17:30</md-tooltip></th>\
                        <th>10°<md-tooltip md-direction='top'>17:30 - 18:30</md-tooltip></th>\
                    </tr></thead>\
                    <tbody>";

            for (var i = 1; i <= 10; i++) {

                try {
                   
                    if (data[i].descrizione != undefined && data[i].stanze != undefined){                  
                        x += "<td>" + data[i].descrizione  + "<br>" + data[i].stanze + "</td>";

                    } else if(data[i].descrizione != undefined && data[i].stanze == undefined){
                        x += "<td>" + data[i].descrizione.toLowerCase()  + "</td>";

                    } else {

                        if (data[i].risorsa == undefined || data[i].risorsa == null){
                            x += "<td>&nbsp;</td>";
                        } else if (data[i].professore2 == null && data[i].professoreS == null){
                            x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                        } else if (data[i].professoreS == null && data[i].professore2 != null){
                            x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                        } else if (data[i].professore1 == null && data[i].professore2 != null && data[i].professoreS != null){
                            x += "<td><span class='nome'>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].stanza + "</td>";
                        }       
                    }

                } catch (e){
                    x += "<td>&nbsp;</td>";
                }
            }               
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;

        } else if (tipo == 'prof'){
            var x = "<table class=\"table\">\
                    <thead><tr>\
                        <th>1°<md-tooltip md-direction='top'>8:00 - 9:00</md-tooltip></th>\
                        <th>2°<md-tooltip md-direction='top'>9:00 - 9:50</md-tooltip></th>\
                        <th>3°<md-tooltip md-direction='top'>10:00 - 11:00</md-tooltip></th>\
                        <th>4°<md-tooltip md-direction='top'>11:00 - 11:50</md-tooltip></th>\
                        <th>5°<md-tooltip md-direction='top'>12:00 - 12:55</md-tooltip></th>\
                        <th>6°<md-tooltip md-direction='top'>12:55 - 14:30</md-tooltip></th>\
                        <th>7°<md-tooltip md-direction='top'>14:30 - 15:30</md-tooltip></th>\
                        <th>8°<md-tooltip md-direction='top'>15:30 - 16:30</md-tooltip></th>\
                        <th>9°<md-tooltip md-direction='top'>16:30 - 17:30</md-tooltip></th>\
                        <th>10°<md-tooltip md-direction='top'>17:30 - 18:30</md-tooltip></th>\
                    </tr></thead>\
                    <tbody>";

            for (var i = 1; i <= 10; i++) {

                try {
                   
                    if (data[i].descrizione != undefined && data[i].stanze != undefined){
                        
                        x += "<td>" + data[i].descrizione  + "<br>" + data[i].stanze + "</td>";

                    }else{

                        if (data[i].stanza != null && data[i].risorsa != null){
                            x += "<td>" + data[i].risorsa + "<br>" + data[i].stanza + "</td>";

                        }else if (data[i].stanza != null && data[i].risorsa == null){
                            x += "<td>" + data[i].stanza + "</td>";

                        }else if (data[i].stanza == null && data[i].risorsa != null){
                            x += "<td>" + data[i].risorsa + "</td>";
                        }
                        
                    }

                } catch (e){

                    x += "<td>&nbsp;</td>";
                }

            }               
            
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;

        } else if (tipo == 'aula'){
               var x = "<table class=\"table\">\
                        <thead><tr>\
                        <th>1°<md-tooltip md-direction='top'>8:00 - 9:00</md-tooltip></th>\
                        <th>2°<md-tooltip md-direction='top'>9:00 - 9:50</md-tooltip></th>\
                        <th>3°<md-tooltip md-direction='top'>10:00 - 11:00</md-tooltip></th>\
                        <th>4°<md-tooltip md-direction='top'>11:00 - 11:50</md-tooltip></th>\
                        <th>5°<md-tooltip md-direction='top'>12:00 - 12:55</md-tooltip></th>\
                        <th>6°<md-tooltip md-direction='top'>12:55 - 14:30</md-tooltip></th>\
                        <th>7°<md-tooltip md-direction='top'>14:30 - 15:30</md-tooltip></th>\
                        <th>8°<md-tooltip md-direction='top'>15:30 - 16:30</md-tooltip></th>\
                        <th>9°<md-tooltip md-direction='top'>16:30 - 17:30</md-tooltip></th>\
                        <th>10°<md-tooltip md-direction='top'>17:30 - 18:30</md-tooltip></th>\
                    </tr></thead>\
                    <tbody>";

            for (var i = 0; i < 10; i++) {

                try {

                    if (data[i].risorsa == null) {
                        x += "<td>&nbsp;</td>";
                    } else if (data[i].professore2 == null && data[i].professoreS == null && data[i].professore1 != null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].risorsa + " </td>";
                    } else if (data[i].professore1 == null && data[i].professore2 == null && data[i].professoreS == null){
                        x += "<td>" + data[i].risorsa + " </td>";
                    } else if (data[i].professore2 == null && data[i].professoreS == null && data[i].professore1 != null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "</span><br>" + data[i].risorsa + " </td>";
                    } else if (data[i].professoreS == null && data[i].professore1 != null && data[i].professore2 != null){
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() +"<br>" + data[i].professore2.toLowerCase() + "</span><br>" + data[i].risorsa + " </td>";
                    } else {
                        x += "<td><span class='nome'>" + data[i].professore1.toLowerCase() + "<br>" + data[i].professore2.toLowerCase() + "<br>" + data[i].professoreS.toLowerCase() + "</span><br>" + data[i].risorsa + " </td>";
                    }

                } catch (e){
                    x += "<td>&nbsp;</td>";
                }

            }
            x += "</tbody>";
            x += "</table>";
            $scope.htmlTable = x;
        }
    }

});

