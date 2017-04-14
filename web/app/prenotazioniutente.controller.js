app.
    controller("PrenotazioniUtenteCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope) {

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
            var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
            var weekdays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

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
                        var fgiorno = weekdays[giorno.getDay()] + " " + giorno.getDate() + " " + months[giorno.getMonth()] + " " + giorno.getFullYear();
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
                    var fgiorno = weekdays[giorno.getDay()] + " " + giorno.getDate() + " " + months[giorno.getMonth()] + " " + giorno.getFullYear();
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
        $scope.approva = function() {
            console.log("approvato");
        };


        /**
         * approves a request of 'prenotazione'
         */
        $scope.nonApprova = function(giorno, stanza, risorsa, ora) {
            //send email to...
            
            $scope.removePrenotazione(giorno, stanza, risorsa, ora);
        };

    });