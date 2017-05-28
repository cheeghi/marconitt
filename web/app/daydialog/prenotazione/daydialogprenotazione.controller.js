app
    .controller('DayDialogPrenotazioneCtrl', function($scope, $http, $mdToast, $mdDialog, $mdDateLocale, $rootScope, day) {

        $scope.day = day; // selected day
        $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear(); // day string displayed at the top of the dialog


        /**
         * increases the day
         */
        $scope.nextDay = function() {

            day.setDate(day.getDate() + 1);
            var limitDay = new Date();
            limitDay.setDate(limitDay.getDate() + $rootScope.giorniLimite);

            if (day > limitDay && !$rootScope.admin) {
                $mdToast.show($mdToast.simple().textContent('Seleziona una data più vicina'));
                day.setDate(day.getDate() - 1);
            } else {
                $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();   
                $rootScope.$broadcast('reInitPrenota', {
                    day: day
                });
            }
        };


        /**
         * decreases the day
         */
        $scope.previousDay = function() {

            day.setDate(day.getDate() - 1);
            var today = new Date();
            today.setHours(0); // we need to do these sets, otherwise the comparison doesnt work
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            if (day < today) {
                $mdToast.show($mdToast.simple().textContent('Non puoi prenotare per un giorno passato'));
                day.setDate(day.getDate() + 1);
            } else {
                $scope.dayString = $mdDateLocale.days[day.getDay()] + " " + day.getDate() + " " + $mdDateLocale.months[day.getMonth()] + " " + day.getFullYear();   
                $rootScope.$broadcast('reInitPrenota', {
                    day: day
                });
            }
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
