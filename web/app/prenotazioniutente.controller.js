app.
    controller("PrenotazioniUtenteCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.admin = $rootScope.admin; // is protocollo or not
        $scope.prenotazioni;


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
            if($scope.admin) {
                console.log("admin profile");
                $http.get('http://marconitt.altervista.org/progetti.php', {  
                    params: {
                        admin: $scope.admin
                    }
                }).success(function(response) {
                    $scope.prenotazioni = response;
                    console.log(response);
                });
            } else {
                $http.get('http://marconitt.altervista.org/progetti.php', {
                    cache: false,
                    params: {
                        prenotazioni: $rootScope.username
                    }
                }).success(function(response) {
                    $scope.prenotazioni = response;
                    console.log(response);
                });     
            }         
        };


        /**
         * call the server method for removing a 'prenotazione'
         */
        $scope.removePrenotazione = function(giorno, stanza, risorsa, ora) {
            console.log(giorno, stanza, risorsa, ora, $rootScope.username);
        };

    });