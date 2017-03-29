app.
    controller("ConfermaPrenotazioneCtrl", function($scope, $http, $window, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.prenotazioneString = $rootScope.prenotazioneString;
        $scope.sClass = $rootScope.sClass;
        $scope.classes;
        $scope.rooms;
        $scope.teachers;
        $scope.admin = $rootScope.admin;

        $http.get('http://88.149.220.222/orario/api.php', {  
            params: {
                search: ""
            }
        }).success(function(response) {
            $scope.classes = response.classes;
            $scope.rooms = response.rooms;
            $scope.teachers = response.teachers;
        });


        $scope.prenota = function() {
            /*console.log($rootScope.stanzaPrenotata);
            console.log($rootScope.oraPrenotata);
            console.log($rootScope.prenotazioneString);
            console.log($rootScope.giornoSelezionato);
            console.log($scope.sClass);*/
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/prenota',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "token="+$rootScope.token+"&stanza="+$rootScope.stanzaPrenotata+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoSelezionato
                    + "&risorsa="+$scope.sClass
            };
            
            $http(req)
                .success(function(data) {
                    $scope.cancel();
                    $scope.refresh();
                    $mdToast.show($mdToast.simple().textContent('Prenotazione avvenuta con successo!'));

                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('Errore'));
                });

        };


        $scope.refresh = function() {
            $rootScope.$broadcast("refreshTable", {});
        }

                
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

    });