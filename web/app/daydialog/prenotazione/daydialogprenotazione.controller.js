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

            if (day > limitDay && !$rootScope.admin)
                $mdToast.show($mdToast.simple().textContent('Seleziona una data più vicina'));
            else {
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

            if (day < today  && !$rootScope.admin)
                $mdToast.show($mdToast.simple().textContent('Non puoi prenotare per un giorno passato'));
            else {
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


        /**
         *
         */
        $scope.$on("dimension", function (event, args) {
            $scope.dimension();
        });


        /**
         *
         */
        $scope.dimension = function() {
			var boolD = false;

			//fix table dimension
            var table = document.getElementById("orario");
            var tableHeight = table.clientHeight;
            var tableWidth = table.clientWidth;
            if (boolD) {
				console.log("fix table dimension height: " + tableHeight);
				console.log("fix table dimension width: " + tableWidth);
			}

			//page dimension
			var page = document.getElementById("contentPrenotazione");
			var pageWidth = page.clientWidth;
            var pageHeight = page.clientHeight;
			if (boolD) {
				console.log("page dimension width: " + pageWidth);
                console.log("page dimension height: " + pageHeight);
			}

            if (tableWidth > pageWidth && tableHeight > pageHeight) {
                console.log("inserire scroll verticale");
                if (boolD) {
                    console.log("width fix table: " + tableWidth);
                    console.log("width page: " + pageWidth);
                    console.log("inserire scroll orizzontale");
                    console.log("height fix table: " + tableHeight);
                    console.log("height page: " + pageHeight);
                    console.log("inserire scroll verticale");
                }
                //add vertical and orizzontal scroll
            } else if (tableWidth > pageWidth) {
                console.log("inserire scroll orizzontale");
				if (boolD) {
					console.log("width fix table: " + tableWidth);
					console.log("width page: " + pageWidth);
					console.log("inserire scroll orizzontale");
				}
                //add orizzontal scroll
			} else if (tableHeight > pageHeight) {
                console.log("inserire scroll verticale");
                if (boolD) {
                    console.log("height fix table: " + tableHeight);
                    console.log("height page: " + pageHeight);
                    console.log("inserire scroll verticale");
                }
                //add vertical scroll
            } else {
                console.log("normal dimension");
                console.log("table width: " + tableWidth);
                console.log("table height: " + tableHeight);
                console.log("page width: " + pageWidth);
                console.log("page height: " + pageHeight);
            }

        };
    });
