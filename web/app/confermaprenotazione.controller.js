app.
    controller("ConfermaPrenotazioneCtrl", function($scope, $http, $window, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.prenotazioneString = $rootScope.prenotazioneString;
        $scope.classes;
        $scope.rooms;
        $scope.teachers;
        $scope.progetti;
        $scope.admin = $rootScope.admin;
        $scope.tipoPrenotazione;
        $scope.sProgetto;
        $scope.sClass;
        $scope.sDescrizione;


        $http.get('http://marconitt.altervista.org/progetti.php?progetti').success(function(response) {
            //console.log(response.processi);
            $scope.progetti = response.progetti;
        });


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
            var risorsa;
            var isClasse = false;

            if ($scope.admin) {
                if ($scope.tipoPrenotazione == 'Classe') {
                    risorsa = $scope.sClass;
                    isClasse = true;
                } else if ($scope.tipoPrenotazione == 'Progetto') {
                    risorsa = $scope.sProgetto;
                } else if ($scope.tipoPrenotazione == 'Altro') {
                    risorsa = $scope.sDescrizione;
                } else {
                    risorsa = $scope.tipoPrenotazione + ": " + $scope.sClass;
                }
            } else {
                risorsa = $scope.sClass;
                isClasse = true;
            }

            var data = "token="+$rootScope.token+"&stanza="+$rootScope.stanzaPrenotata+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoSelezionato
                    + "&risorsa="+ risorsa+ "&isclasse="+ isClasse+ "&user="+ $rootScope.username;

            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/prenota',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
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


        $scope.resetMdSelect = function() {
            $scope.sClass = undefined;
            $scope.sProgetto = undefined;
            $scope.sDescrizione = undefined;
        };

    });