app.
    controller("PrenotazioniUtenteCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.admin = $rootScope.admin; // is protocollo or not
        $scope.prenotazioni;
        $scope.disabled;


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
            $http.get('http://marconitt.altervista.org/progetti.php', {  
                cache: false,
                params: {
                    prenotazioni: $rootScope.username,
                    isprotocollo: $scope.admin
                }
            }).success(function(response) {
                console.log("****");
                $scope.prenotazioni = response;
            });         
        };


        /**
         * calls the server method for removing a 'prenotazione'
         */
        $scope.removePrenotazione = function(giorno, stanza, risorsa, ora) {
            console.log(giorno, stanza, risorsa, ora, $rootScope.username);
            $scope.disabled = true;
            //chiamata .success 
            $scope.initializeHttpCalls();
            console.clear();
        };

    });