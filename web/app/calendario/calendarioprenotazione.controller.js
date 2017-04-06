app
    .controller('CalendarioPrenotazioneCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, CONFIG, $rootScope) {
        
        giorniLimite = 14;
        $scope.dayClick = function(date) {
            tplUrl = 'tpl/daydialog/daydialogprenotazione.tpl.html';
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            $scope.day = new Date(date);
            var limitDay = new Date();
            limitDay.setDate(limitDay.getDate() + giorniLimite);
            if (($scope.day > limitDay && !$rootScope.admin) || ($scope.day < today  && !$rootScope.admin)) {
                $mdToast.show($mdToast.simple().textContent("Selezionare un'altra data"));
            }



            else{$mdDialog.show({
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
