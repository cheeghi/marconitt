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
            $http.get('http://marconitt.altervista.org/progetti.php', {  
                params: {
                    prenotazioni: $rootScope.username
                }
            }).success(function(response) {
                $scope.prenotazioni = response;
                console.log(response);
            });            
        };


        /**
         * call the server method for removing a 'prenotazione'
         */
        $scope.removePrenotazione = function(giorno, stanza, risorsa, ora) {
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
                    console.log("ciao");

                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('lol'));
                });
        };

    });