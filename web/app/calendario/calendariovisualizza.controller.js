app
    .controller('CalendarioVisualizzaCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, CONFIG, $rootScope) {

        $scope.dayClick = function(date) {
            tplUrl = 'tpl/daydialog/daydialogvisualizza.tpl.html';
                
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
        };

    });
