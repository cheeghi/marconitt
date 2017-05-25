app
    .controller('DayDialogVisualizzaCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, $mdDateLocale, $rootScope, $httpParamSerializerJQLike, CONFIG, day) {

        $scope.day = day;
        $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();
        var giorniLimite = 14; // range di prenotazione per un professore;


        /**
         * increases the day
         * @param inPrenotazione
         */
        $scope.nextDay = function() {
            day.setDate(day.getDate() + 1);    
    
            $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();   
            $rootScope.$broadcast('reInitVisualizza',{day:day});
            $rootScope.$broadcast('reInitEvents');
        }


        /**
         * decreases the day
         * @param inPrenotazione
         */
        $scope.previousDay = function() {
            day.setDate(day.getDate() - 1);
            
            $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();   
            $rootScope.$broadcast('reInitVisualizza',{day:day});
            $rootScope.$broadcast('reInitEvents');
        }


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
         *
         * @param answer
         */
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

    });
