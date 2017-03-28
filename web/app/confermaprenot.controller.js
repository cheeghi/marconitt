app.
    controller("ConfermaPrenotazioneCtrl", function($scope, $filter, $http, $q, $window, $sce, $mdDateLocale, CONFIG, $mdDialog, $mdToast, $rootScope, $timeout) {
        
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.prenota = function() {
            /*console.log("lab prenotato:" + $rootScope.stanzaPrenotata);
            console.log("ora prenotato:" + $rootScope.oraPrenotata);
            console.log("giorno prenotato:" + $rootScope.giornoSelezionato);*/
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/prenota',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "token="+$rootScope.token+"&stanza="+$rootScope.stanzaPrenotata+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoSelezionato
                    + "&risorsa="+$scope.sClass
            };
            console.log(req.data);
            $http(req)
                .success(
                    function(data) {
                        console.log(data);
                        $scope.cancel();
                    }
                );

        };

        $scope.refresh = function() {
            //$rootScope.$emit("getPrenotazioni", {});
            
            $scope.$broadcast("refreshEvent", {});
        }

    });