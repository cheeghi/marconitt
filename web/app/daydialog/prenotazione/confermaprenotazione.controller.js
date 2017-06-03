app.
    controller("ConfermaPrenotazioneCtrl", function($scope, $http, CONFIG, $mdDialog, $mdToast, $rootScope) {

        $scope.prenotazioneString = $rootScope.prenotazioneString; // string displayed at the top of the dialog
        $scope.classes; // array of classes
        $scope.rooms; // array of rooms
        $scope.teachers; // array of teachers
        $scope.progetti; // array of projects
        $scope.admin = $rootScope.admin; // is admin or not
        $scope.tipoPrenotazione; // tipo di prenotazione (ex. classe, consiglio di classe, progetto, ecc...)
        $scope.sProgetto; // progetto selezionato
        $scope.sClass; // selected class
        $scope.sTeacher; // selected teacher
        $scope.sDescrizione; // descrizione inserita
        $scope.disabled; // boolean for confirm button disabling
        $scope.teacherClasses; // list of teacher's classes (classes of the teacher logged in)
        $scope.sTeacherClass; // selected teacher class


        /**
         * initialization method
         */
        $scope.init = function() {
            $scope.initializeHttpCalls();
        };


        /**
         * makes http requests to populate classes, rooms, teachers, progetti arrays
         */
        $scope.initializeHttpCalls = function() {

            $http.get('http://'+CONFIG.TIMETABLE)
                .success(function(response) {
                
                    $scope.classes = response.classes;
                    $scope.teachers = response.teachers;
                    $scope.progetti = response.projects;
                
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });
            
            if (!$rootScope.admin) {
                $http.get('http://'+CONFIG.TIMETABLE, {
                    params: {
                        classesbyteacher: $rootScope.username
                    }
                }).success(function(response) {
                    
                    $scope.teacherClasses = response;
                    
                }).error(function() {
                    $mdToast.show($mdToast.simple().textContent("Errore di rete!"));
                });
            }
        };


        /**
         * makes a 'prenotazione' request to the server
         */
        $scope.prenota = function() {

            $scope.disabled = true;
            var risorsa = '';
            var isClasse = false;
            var classe = !$scope.sClass ? $scope.sTeacherClass : $scope.sClass;
            
            if ($scope.admin) {
                switch ($scope.tipoPrenotazione) {
                    case "Classe":
                        risorsa = classe;
                        isClasse = true;
                        break;
                    case "Progetto":
                        risorsa = 'Progetto: ' + $scope.sProgetto;    
                        break;
                    case "Sportello":
                        risorsa = "Sportello: " + $scope.sTeacher;
                        break;
                    case "Altro":
                        risorsa = $scope.sDescrizione;
                        break;
                    case "Tutoraggio/Studio":
                        risorsa = $scope.tipoPrenotazione;
                        break;
                    default:
                        risorsa = $scope.tipoPrenotazione + ": " + classe;
                }

            } else {
                risorsa = classe;
                isClasse = true;
            }

            //var data = "token="+sessionStorage.token+"&stanza="+$rootScope.stanzaPrenotata+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoSelezionato + "&risorsa="+ risorsa+ "&isclasse="+ isClasse+ "&user="+ $rootScope.username+ "&admin="+ $rootScope.admin;
            var data = "token="+sessionStorage.token+"&stanza="+$rootScope.stanzaPrenotata+"&ora="+$rootScope.oraPrenotata+"&giorno="+$rootScope.giornoSelezionato + "&risorsa="+ risorsa+ "&isclasse="+ isClasse;

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
                    if (data) {
                        $scope.cancel();
                        $scope.refresh();
                        $mdToast.show($mdToast.simple().textContent('Prenotazione avvenuta con successo!'));   
                    } else {
                        $mdToast.show($mdToast.simple().textContent("Errore durante la prenotazione"));
                        $scope.cancel();
                    }
                }).error(function(err) {
                    $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                });
        };


        /**
         * refreshes 'prenotazioni' table
         */
        $scope.refresh = function() {
            $rootScope.$broadcast("refreshTable", {});
        };


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