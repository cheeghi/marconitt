app
    .controller('CalendarioPrenotazioneCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, CONFIG, $rootScope) {
        
        var giorniLimite = 14;


        $scope.dayClick = function(date) {
            var tplUrl = 'tpl/daydialog/daydialogprenotazione.tpl.html';
            $scope.day = new Date(date);
            var today = new Date();
            var limitDay = new Date();
            today.setHours(0); // we need to do these sets, otherwise the comparison doesnt work
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            limitDay.setDate(limitDay.getDate() + giorniLimite);

            if ($scope.day > limitDay && !$rootScope.admin) {
                $mdToast.show($mdToast.simple().textContent("Seleziona una data più vicina"));
            } else if ($scope.day < today && !$rootScope.admin) {
                $mdToast.show($mdToast.simple().textContent("Non puoi prenotare per un giorno passato"));
            } else {
                $mdDialog.show({
                    templateUrl: tplUrl,
                    controller: 'DayDialogCtrl',
                    clickOutsideToClose: true,
                    locals: {
                        day: date
                    }
                })
                .then(function(answer) {
                    getData();
                    $scope.selectOptions();
                }, function() {
                    getData();
                    $scope.selectOptions();
                });
            }
        };

    });
