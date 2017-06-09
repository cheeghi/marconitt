app
    .controller('CalendarioPrenotazioneCtrl', function($scope, $timeout, MaterialCalendarData, $mdToast, $mdDialog, $rootScope) {

        $scope.direction = "horizontal"; // calendar direction
        $scope.selectedDate; // selected day in the calendar
        $scope.isLoading = true; // used for isLoading circle
        $scope.calendar = '';
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getFullYear();


        /**
         * initialization method
         */
        $scope.init = function() {
            $scope.resetCalendar(); // i need to clear the calendar because 'visualizza' and 'prenotazione' share the same calendar data
            MaterialCalendarData.setDayContent(new Date(), '<md-button style="background-color: green;" class="md-fab md-mini md-tiny type">T<md-tooltip md-direction="top">Today!</md-tooltip></md-button>');
            $timeout(function() {
                $scope.isLoading = false;
            }, $rootScope.loadingTime);
        };


        /**
         * clears calendar content
         */
        $scope.resetCalendar = function() {

            // we need to clear the current, the previous and the next month 
            for (i = 1; i <= 31; i++)
                MaterialCalendarData.setDayContent(new Date($scope.currentYear + "-" + ($scope.currentMonth) + '-' + i), ' ');
            for (i = 1; i <= 31; i++)
                MaterialCalendarData.setDayContent(new Date($scope.currentYear + "-" + ($scope.currentMonth+1) + '-' + i), ' ');
            for (i = 1; i <= 31; i++)
                MaterialCalendarData.setDayContent(new Date($scope.currentYear + "-" + ($scope.currentMonth-1) + '-' + i), ' ');
        };


        /**
         * opens the dialog at click
         * @param date
         */
        $scope.dayClick = function(date) {

            var tplUrl = 'tpl/daydialog/daydialogprenotazione.tpl.html'; // html code to insert into the dialog
            $scope.day = new Date(date);
            var today = new Date();
            var limitDay = new Date();
            today.setHours(0); // we need to do these sets, otherwise the comparison doesnt work
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            limitDay.setDate(limitDay.getDate() + $rootScope.giorniLimite);

            if ($scope.day > limitDay && !$rootScope.admin)
                $mdToast.show($mdToast.simple().textContent("Seleziona una data più vicina"));
            else if ($scope.day < today)
                $mdToast.show($mdToast.simple().textContent("Non puoi prenotare per un giorno passato"));
            else {
                $mdDialog.show({
                    templateUrl: tplUrl,
                    controller: 'DayDialogPrenotazioneCtrl',
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
            $scope.resetCalendar();
        };


        /**
         * increases the month
         * @param date
         */
        $scope.nextMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
            $scope.resetCalendar();
        };

    });
