app
    .controller('CalendarioVisualizzaCtrl', function($scope, $timeout, $http, MaterialCalendarData, $mdToast, $mdDialog, CONFIG, $rootScope) {

        $scope.direction = "horizontal"; // calendar direction
        $scope.selectedDate; // selected day in the calendar
        $scope.isLoading = true; // used for isLoading circle
        $scope.calendar = '';
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getFullYear();


        /**
         * retrieves events data and fills the calendar
         */
        $scope.getData = function() {
            $scope.resetCalendar();
            
            var req = {
                method: 'GET',
                url: 'http://'+CONFIG.TIMETABLE+'?eventscountbymonth='+ ($scope.currentMonth),
                cache: false
            };

            $http(req)
                .then(function(data) {

                    data.data.forEach(function(entry) {
                        var d = new Date(entry.giorno);
                        var evento_or_eventi = parseInt(entry.quantity) > 1 ? 'eventi' : 'evento';
                        MaterialCalendarData.setDayContent(d, '<md-button class="md-fab md-mini md-tiny type">' + entry.quantity + '<md-tooltip md-direction="top">' + entry.quantity + ' ' + evento_or_eventi + '</md-tooltip></md-button>');
                    }, this);

                    $timeout(function() {
                        $scope.isLoading = false
                    }, $rootScope.loadingTime);

                }, function(err) {
                    $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi"));
                });
        };


        /**
         * opens the dialog at click
         * @param date
         */
        $scope.dayClick = function(date) {

            tplUrl = 'tpl/daydialog/daydialogvisualizza.tpl.html';
                
            $mdDialog.show({
                templateUrl: tplUrl,
                controller: 'DayDialogVisualizzaCtrl',
                clickOutsideToClose: true,
                locals: {
                    day: date
                }
            });
        };


        /**
         * decreases the month
         * @param date
         */
        $scope.prevMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
            $scope.getData();
        };


        /**
         * increases the month
         * @param date
         */
        $scope.nextMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
            $scope.getData();
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

    });
