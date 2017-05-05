app
    .controller('CalendarioVisualizzaCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, CONFIG, $rootScope) {

        $scope.direction = "horizontal";
        $scope.selectedDate;
        $scope.isLoading = true; // used for isLoading circle
        $scope.calendar = '';
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getFullYear();


        /**
         * retrieves events data and fills the calendar
         */
        $scope.getData = function () {
            //$timeout(function() { $scope.isLoading = false }, $rootScope.loadingTime);
            
            var req = {
                method: 'GET',
                url: 'http://localhost/timetable.php?eventscountbymonth='+ ($scope.currentMonth)
            }
            $http(req)
                .then(function (data) {
                    console.log(data.data);
                    data.data.forEach(function(entry) {
                        var d = new Date(entry.giorno);
                        console.log(entry.quantity);
                        MaterialCalendarData.setDayContent(d, '<md-button class="md-fab md-mini md-tiny type">' + entry.quantity + '</md-button>');
                    }, this);
                    $timeout(function() { $scope.isLoading = false }, $rootScope.loadingTime);
                }, function(err) {
                    $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi: " + (err.data || "il server non risponde")));
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
        }


        /**
         * increases the month
         * @param date
         */
        $scope.nextMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
            $scope.getData();
        }
    });
