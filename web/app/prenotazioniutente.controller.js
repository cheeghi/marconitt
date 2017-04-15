app.
    controller("PrenotazioniUtenteCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope, $mdDateLocale) {

        $scope.admin = $rootScope.admin; // is admin or not
        $scope.prenotazioni;
        $scope.prenotazioniDaApprovare;
        $scope.disabled;
        $scope.caricamentoPrenotazioni;

        /**
         * initialize method
         */
        $scope.init = function() {
            $scope.caricamentoPrenotazioni = true;
            $scope.initializeHttpCalls();
        };


        /**
         * makes http requests to populate 'prenotazioni' arrays
         */
        $scope.initializeHttpCalls = function() {
            $scope.caricamentoPrenotazioni = true;            

            if ($scope.admin) {
                $http.get('http://localhost/timetable.php', {  
                    cache: false,
                    params: {
                        prenotazioniexceptadmin: ""
                    }
                }).success(function(response) {
                    $scope.prenotazioniDaApprovare = response;
                    $scope.prenotazioniDaApprovare.forEach(function(prenotazione) {
                        var giorno = new Date(prenotazione.giorno);
                        var fgiorno = $mdDateLocale.days[giorno.getDay()] + " " + giorno.getDate() + " " + $mdDateLocale.months[giorno.getMonth()] + " " + giorno.getFullYear();
                        prenotazione.fgiorno = fgiorno;
                    });
                });      
            } 

            $http.get('http://localhost/timetable.php', {  
                cache: false,
                params: {
                    prenotazioni: $rootScope.username
                }
            }).success(function(response) {
                $scope.prenotazioni = response;
                $scope.prenotazioni.forEach(function(prenotazione) {
                    var giorno = new Date(prenotazione.giorno);
                    var fgiorno = $mdDateLocale.days[giorno.getDay()] + " " + giorno.getDate() + " " + $mdDateLocale.months[giorno.getMonth()] + " " + giorno.getFullYear();
                    prenotazione.fgiorno = fgiorno;
                });

                $scope.caricamentoPrenotazioni = false;
            });         
        };


        /**
         * calls the server method for removing a 'prenotazione'
         */
        $scope.removePrenotazione = function(giorno, stanza, risorsa, ora) {
            //console.log(giorno, stanza, risorsa, ora, $rootScope.username);
            //$scope.disabled = true;
            $scope.caricamentoPrenotazioni = true;

            var data = "token="+$rootScope.token+"&stanza="+stanza+"&ora="+ora+"&giorno="+giorno
                    + "&risorsa="+ risorsa;
            console.log(ora);
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/cancellaPrenotazione',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };


            $http(req)
                .success(function(data) {
                    $scope.prenotazioni = null;
                    $scope.initializeHttpCalls();
                    $mdToast.show($mdToast.simple().textContent('Cancellazione avvenuta con successo'));                   
                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('Errore durante la cancellazione'));
                });

        };


        /**
         * approves a request of 'prenotazione'
         */
        $scope.approva = function(giorno, stanza, ora) {
            console.log("approvato");

            var data = "token="+$rootScope.token+"&stanza="+stanza+"&ora="+ora+"&giorno="+giorno;
            
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
                    $scope.prenotazioni = null;
                    $scope.initializeHttpCalls();
                    $mdToast.show($mdToast.simple().textContent('Prenotazione approvata con successo'));                   
                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('Errore durante la cancellazione'));
                });            
        };


        /**
         * denies a request of 'prenotazione'
         */
        $scope.nonApprova = function(giorno, stanza, risorsa, ora) {
            //send email to...
            
            $scope.removePrenotazione(giorno, stanza, risorsa, ora);
        };


        /**
            returns true if the given day is passed
        */
        $scope.isPassed = function(giorno) {
            var today = new Date();
            today.setHours(0); // we need to do these sets, otherwise the comparison doesnt work
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            if (today > new Date(giorno))
                return true;            
        };

    });