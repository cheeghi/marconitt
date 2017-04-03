app.
    controller("PrenotazioniUtenteCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.admin = $rootScope.admin; // is protocollo or not
        $scope.prenotazioni;
        $scope.eventiCreati;
        $scope.prenotazioniDaApprovare;
        $scope.disabled;
        $scope.caricamentoPrenotazioni;

        /**
         * initialize method
         */
        $scope.init = function() {
            $scope.initializeHttpCalls();
        };


        /**
         * makes http requests to populate 'prenotazioni' arrays
         */
        $scope.initializeHttpCalls = function() {
            $scope.disabled = false;  
            $scope.caricamentoPrenotazioni = true;

            if ($scope.admin) {
                $http.get('http://marconitt.altervista.org/timetable.php', {  
                    cache: false,
                    params: {
                        prenotazionidaapprovare: ""
                    }
                }).success(function(response) {
                    $scope.prenotazioniDaApprovare = response;
                });      
            } 

            $http.get('http://marconitt.altervista.org/timetable.php', {  
                cache: false,
                params: {
                    prenotazioni: $rootScope.username
                }
            }).success(function(response) {
                $scope.prenotazioni = response;
                $scope.caricamentoPrenotazioni = false;
            });           
        };


        /**
         * calls the server method for removing a 'prenotazione'
         */
        $scope.removePrenotazione = function(giorno, stanza, risorsa, ora) {
            //console.log(giorno, stanza, risorsa, ora, $rootScope.username);
            $scope.disabled = true;
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
                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('lol'));
                });

        };


        /**
         * approves a request of 'prenotazione'
         */
        $scope.approva = function() {
            console.log("approvato");
        };

    });