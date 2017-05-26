app.
    controller("PrenotazioniUtenteCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope, $mdDateLocale, $timeout) {

        $scope.admin = $rootScope.admin; // is admin or not
        $scope.miePrenotazioni; // array that contains logged user's reservations
        $scope.fMiePrenotazioni = []; // filtered array of $scope.miePrenotazioni    
        $scope.altrePrenotazioni; // array that contains every user's reservations
        $scope.fAltrePrenotazioni = []; // filtered array of $scope.altrePrenotazioni
        $scope.events; // array that contains admin events
        $scope.fEvents = []; // filtered array of $scope.events    
        $scope.passedMiePrenotazioni = false; // toggle for showing / not showing passed reservations
        $scope.passedAltrePrenotazioni = false; // toggle for showing / not showing passed reservations
        $scope.passedEventi = false; // toggle for showing / not showing passed reservations
        $scope.isLoading; // used for loading circle

    
        /**
         * initialization method
         */
        $scope.init = function() {
            $scope.isLoading = true;
            $scope.initializeHttpCalls();
        };


        /**
         * makes http requests to populate 'prenotazioni' arrays
         */
        $scope.initializeHttpCalls = function() {

            $scope.isLoading = true;

            if ($scope.admin) {
                $http.get('http://'+CONFIG.TIMETABLE, {
                    cache: false,
                    params: {
                        prenotazioniexceptadmin: ""
                    }
                }).success(function(response) {

                    $scope.altrePrenotazioni = response;
                    $scope.altrePrenotazioni.forEach(function(prenotazione) {
                        var giorno = new Date(prenotazione.giorno);
                        var fgiorno = $mdDateLocale.days[giorno.getDay()] + " " + giorno.getDate() + " " + $mdDateLocale.months[giorno.getMonth()] + " " + giorno.getFullYear();
                        prenotazione.fgiorno = fgiorno;
                    });
                    $scope.fillsAltrePrenotazioni();

                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });    

                $http.get('http://'+CONFIG.TIMETABLE, {
                    cache: false,
                    params: {
                        events: "" 
                    }
                }).success(function(response) {

                    $scope.events = response;
                    $scope.events.forEach(function(prenotazione) {
                        var giorno = new Date(prenotazione.giorno);
                        var fgiorno = $mdDateLocale.days[giorno.getDay()] + " " + giorno.getDate() + " " + $mdDateLocale.months[giorno.getMonth()] + " " + giorno.getFullYear();
                        prenotazione.fgiorno = fgiorno;
                    });
                    $scope.fillsEventi();

                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });  
            } 

            $http.get('http://'+CONFIG.TIMETABLE, {  
                cache: false,
                params: {
                    prenotazioni: $rootScope.username
                }
            }).success(function(response) {

                $scope.miePrenotazioni = response;
                $scope.miePrenotazioni.forEach(function(prenotazione) {
                    var giorno = new Date(prenotazione.giorno);
                    var fgiorno = $mdDateLocale.days[giorno.getDay()] + " " + giorno.getDate() + " " + $mdDateLocale.months[giorno.getMonth()] + " " + giorno.getFullYear();
                    prenotazione.fgiorno = fgiorno;
                });
                $scope.fillsMiePrenotazioni();

                $timeout(function() {
                    $scope.isLoading = false;
                }, $rootScope.loadingTime);

            }).error(function() {
                $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
            });
        };


        /**
        * populates the fMiePrenotazioni with filtered values
        */
        $scope.fillsMiePrenotazioni = function () {
            if ($scope.passedMiePrenotazioni)
                $scope.fMiePrenotazioni = $scope.miePrenotazioni;
            else {
                $scope.fMiePrenotazioni = [];
                $scope.miePrenotazioni.forEach(function(entry) {
                    if (!$scope.isPassed(entry.giorno))
                        $scope.fMiePrenotazioni.push(entry);
                }, this);
            }
        };


        /**
         * populates the fAltrePrenotazioni with filtered values
         */
        $scope.fillsAltrePrenotazioni = function () {
            if ($scope.passedAltrePrenotazioni)
                $scope.fAltrePrenotazioni = $scope.altrePrenotazioni;
            else {
                $scope.fAltrePrenotazioni = [];
                $scope.altrePrenotazioni.forEach(function(entry) {
                    if (!$scope.isPassed(entry.giorno))
                        $scope.fAltrePrenotazioni.push(entry);
                }, this);
            }
        };


        /**
         * populates the fEvents with filtered values
         */
        $scope.fillsEventi = function () {
            if ($scope.passedEventi)
                $scope.fEvents = $scope.events;
            else {
                $scope.fEvents = [];
                $scope.events.forEach(function(entry) {
                    if (!$scope.isPassed(entry.giorno))
                        $scope.fEvents.push(entry);
                }, this);
            }
        };


        /**
         * toggle to show or not passed reservations
         * @param type
         */
        $scope.toggle = function (type) {
            switch (type) {
                case 1:
                    $scope.passedMiePrenotazioni = $scope.passedMiePrenotazioni ? true : false;    
                    break;
                case 2:
                    $scope.passedAltrePrenotazioni = $scope.passedAltrePrenotazioni ? false : true;
                    break;
                case 3:
                    $scope.passedEventi = $scope.passedEventi ? false : true;
            }   
        };


        /**
         * calls the server method for removing a 'prenotazione'
         * @param giorno
         * @param stanza
         * @param risorsa
         * @param ora
         */
        $scope.removePrenotazione = function(giorno, stanza, risorsa, ora) {

            var confirm = $mdDialog.confirm()
              .textContent('La prenotazione verrà rimossa per sempre. Continuare?')
              .ok('CONFERMA')
              .cancel('ANNULLA');

            $mdDialog.show(confirm).then(function() {
                  
                $scope.isLoading = true;

                var data = "token="+sessionStorage.token+"&stanza="+stanza+"&ora="+ora+"&giorno="+giorno
                        + "&risorsa="+ risorsa;
                
                var req = {
                    method: 'DELETE',
                    url: 'http://'+CONFIG.HOST+':8080/api/cancellaPrenotazione',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: data
                };


                $http(req)
                    .success(function(data) {
                        if (data) {
                            $scope.initializeHttpCalls();
                            $mdToast.show($mdToast.simple().textContent('Prenotazione rimossa con successo'));                       
                        } else {
                            $mdToast.show($mdToast.simple().textContent('Errore durante l\'eliminazione della prenotazione'));
                            $scope.isLoading = false;
                        }
                    }).error(function(err) {
                        $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                    });
                    
            });
        };


        /**
         * approves a request of 'prenotazione'
         * @param giorno
         * @param stanza
         * @param ora
         */
        $scope.approva = function(giorno, stanza, ora) {
            $scope.isLoading = true;
            
            var data = "token="+sessionStorage.token+"&stanza="+stanza+"&ora="+ora+"&giorno="+giorno;
            
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/approva',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };


            $http(req)
                .success(function(data) {
                    if (data) {
                        $scope.initializeHttpCalls();
                        $mdToast.show($mdToast.simple().textContent('Prenotazione approvata con successo'));      
                    } else {
                        $mdToast.show($mdToast.simple().textContent('Errore durante la approvazione'));
                        $scope.isLoading = false;
                    }
                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                });            
        };


        /**
         * denies a request of 'prenotazione'
         * @param giorno
         * @param stanza
         * @param risorsa
         * @param ora
         */
        $scope.nonApprova = function(giorno, stanza, risorsa, ora) {
            //send email to...
            
            $scope.removePrenotazione(giorno, stanza, risorsa, ora);
        };


        /**
         * removes an event
         * @param id
        */
        $scope.removeEvento = function(id) {

            var confirm = $mdDialog.confirm()
              .textContent("L'evento verrà rimosso per sempre. Continuare?")
              .ok('CONFERMA')
              .cancel('ANNULLA');

            $mdDialog.show(confirm).then(function() {
                
                $scope.isLoading = true;

                var data = "token="+sessionStorage.token+"&id="+id;
                var req = {
                    method: 'DELETE',
                    url: 'http://'+CONFIG.HOST+':8080/api/cancellaEvento',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: data
                };

                $http(req)
                    .success(function(data) {
                        if (data) {
                            $scope.initializeHttpCalls();
                            $mdToast.show($mdToast.simple().textContent('Evento rimosso con successo'));                   
                        } else {
                            $mdToast.show($mdToast.simple().textContent('Errore durante l\'eliminazione dell\'evento'));
                            $scope.isLoading = false;
                        }
                    }).error(function(err) {
                        $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                    });
            });
        };


        /**
         * returns true if the given day is passed
         * @param giorno
         * @return boolean
        */
        $scope.isPassed = function(giorno) {
            var today = new Date();
            today.setHours(0); // we need to do these sets, otherwise the comparison doesnt work
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            return today > new Date(giorno);
        };

    });