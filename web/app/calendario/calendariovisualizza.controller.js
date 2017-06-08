app
    .controller('CalendarioVisualizzaCtrl', function($scope, $timeout, $http, MaterialCalendarData, $mdToast, $mdDialog, CONFIG) {

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

            $http.get('http://' + CONFIG.HOST + ':' + CONFIG.PORT + '/eventscountbymonth', {
                cache: false,
                params: {
                    month: $scope.currentMonth
                }
            }).success(function (data) {

                var isEntered = false;
                data.forEach(function(entry) {
                    var d = new Date(entry.giorno);
                    var evento_or_eventi = parseInt(entry.quantity) > 1 ? 'eventi' : 'evento';
                    var dayContent = '<md-button class="md-fab md-mini md-tiny type">' + entry.quantity + '<md-tooltip md-direction="top">' + entry.quantity + ' ' + evento_or_eventi + '</md-tooltip></md-button>';
                    if ($scope.isToday(d)) {
                        dayContent += '<md-button style="background-color: red;" class="md-fab md-mini md-tiny type">T<md-tooltip md-direction="top">Today!</md-tooltip></md-button>';
                        isEntered = true;
                    }
                    MaterialCalendarData.setDayContent(d, dayContent);
                }, this);

                if (!isEntered)
                    MaterialCalendarData.setDayContent(new Date(), '<md-button style="background-color: red;" class="md-fab md-mini md-tiny type">T<md-tooltip md-direction="top">Today!</md-tooltip></md-button>');

                $scope.isLoading = false;

            }).error(function (err) {
                $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi"));
            });
        };


        /**
         * says if the tay is doday
         * @param day
         * @return {boolean}
         */
        $scope.isToday = function (day) {
            var today = new Date();
            return today.getFullYear() == day.getFullYear() && today.getMonth() == day.getMonth() && today.getDate() == day.getDate();
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
