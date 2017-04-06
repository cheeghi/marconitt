app.
    controller("ConfermaPrenotazioneCtrl", function($scope, $http, $window, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.prenotazioneString = $rootScope.prenotazioneString;
        $scope.classes;
        $scope.rooms;
        $scope.teachers;
        $scope.progetti;
        $scope.admin = $rootScope.admin; // is admin or not
        $scope.tipoPrenotazione; // tipo di prenotazione (ex. classe, consiglio di classe, progetto, ecc...)
        $scope.sProgetto; // progetto selezionato
        $scope.sClass; // selected class
        $scope.sTeacher; // selected teacher
        $scope.sDescrizione; // descrizione inserita
        $scope.disabled; // boolean for confirm button disabling


        /**
         * initialize method
         */
        $scope.init = function() {
            $scope.initializeHttpCalls();
        };


        /**
         * makes http requests to populate classes, rooms, teachers, progetti arrays
         */
        $scope.initializeHttpCalls = function() {
            $http.get('http://marconitt.altervista.org/timetable.php').success(function(response) {
                $scope.classes = response.classes;
                $scope.teachers = response.teachers;
                $scope.progetti = response.projects;
            });
        };


        /**
         * makes a 'prenotazione' request to the server
         */
        $scope.prenota = function() {
            /*console.log($rootScope.stanzaPrenotata);
            console.log($rootScope.oraPrenotata);
            console.log($rootScope.prenotazioneString);
            console.log($rootScope.giornoSelezionato);
            console.log($scope.sClass);*/
            $scope.disabled = true;
            var risorsa;
            var isClasse = false;

            if ($scope.admin) {
                if ($scope.tipoPrenotazione == 'Classe') {
                    risorsa = $scope.sClass;
                    isClasse = true;
                } else if ($scope.tipoPrenotazione == 'Progetto') {
                    risorsa = $scope.sProgetto;
                } else if ($scope.tipoPrenotazione == 'Sportello') {
                    risorsa = "Sportello: " + $scope.sTeacher;
                } else if ($scope.tipoPrenotazione == 'Altro') {
                    risorsa = $scope.sDescrizione;
                } else if ($scope.tipoPrenotazione == 'Tutoraggio/Studio') {
                    risorsa = $scope.tipoPrenotazione;
                } else {
                    risorsa = $scope.tipoPrenotazione + ": " + $scope.sClass;
                }
            } else {
                risorsa = $scope.sClass;
                isClasse = true;
            }

            var data = "token="+$rootScope.token+"&stanza="+$rootScope.stanzaPrenotata+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoSelezionato
                    + "&risorsa="+ risorsa+ "&isclasse="+ isClasse+ "&user="+ $rootScope.username+ "&admin="+ $rootScope.admin;

            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/prenota',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };

            console.log(req);
            
            $http(req)
                .success(function(data) {
                    $scope.cancel();
                    $scope.refresh();
                    $mdToast.show($mdToast.simple().textContent('Prenotazione avvenuta con successo!'));

                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('Errore'));
                });

        };


        /**
         * refreshes 'prenotazioni' table
         */
        $scope.refresh = function() {
            $rootScope.$broadcast("refreshTable", {});
        }


        /**
         * closes the mdDialog
         */                
        $scope.cancel = function() {
            $mdDialog.cancel();
        };


        /**
         * clears sClass, sProgetto, sDescrizione options
         */
        $scope.clearMdSelect = function() {
            $scope.sClass = undefined;
            $scope.sProgetto = undefined;
            $scope.sDescrizione = undefined;
        };

    });