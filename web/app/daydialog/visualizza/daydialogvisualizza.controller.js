app
    .controller('DayDialogVisualizzaCtrl', function($scope, $mdDialog, $mdDateLocale, $rootScope, day) {

        $scope.day = day; // selected day
        $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear(); // day string displayed at the top of the dialog


        /**
         * increases the day
         */
        $scope.nextDay = function() {
            day.setDate(day.getDate() + 1);        
            $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();   
            $rootScope.$broadcast('reInitVisualizza',{day:day});
            $rootScope.$broadcast('reInitEvents');
        };


        /**
         * decreases the day
         */
        $scope.previousDay = function() {
            day.setDate(day.getDate() - 1);
            $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();   
            $rootScope.$broadcast('reInitVisualizza',{day:day});
            $rootScope.$broadcast('reInitEvents');
        };


        /**
         * hides the dialog
         */
        $scope.hide = function() {
            $mdDialog.hide();
        };


        /**
         * closes the dialog
         */
        $scope.cancel = function() {
            $mdDialog.cancel();
        };


        /**
         * I dont know what this method does
         * @param answer
         */
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

    });
