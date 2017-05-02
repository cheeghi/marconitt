app
    .controller('CalendarioPrenotazioneCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, CONFIG, $rootScope) {

        $scope.direction = "horizontal";
        $scope.selectedDate;
        $scope.isLoading = true; // used for isLoading circle
        $scope.calendar = '';
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getFullYear();
        var giorniLimite = 14; // range di prenotazione per un professore


        /**
         * initialization method
         */
        $scope.init = function () {
            $scope.resetCalendar(); // i need to clear the calendar because 'visualizza' and 'prenotazione' share the same calendar data
            $timeout(function() { $scope.isLoading = false }, $rootScope.loadingTime);
        };


        /**
         * clears the calendar content
         */
        $scope.resetCalendar = function () {
            for (j = 1; j <= 12; j++) {
                for (i = 1; i <= 31; i++) {
                    MaterialCalendarData.setDayContent(new Date($scope.currentYear + "-" + j + '-' + i), ' ');
                }    
            }
        };


        /**
         * opens the dialog at click
         * @param date
         */
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
                });
            }
        };


        /**
         * decreases the month
         * @param date
         */
        $scope.prevMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
        }


        /**
         * increases the month
         * @param date
         */
        $scope.nextMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
        }

    });
