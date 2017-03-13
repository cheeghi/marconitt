app
    .controller('ViewCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, CONFIG, $rootScope) {

        $scope.direction = "horizontal";
        $scope.selectedDate;
        $scope.isLoading = true;
        $scope.currentMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getFullYear();
        $scope.events = {};
        $scope.calendar = '';


        var getData = function() {
            console.log("get data");
            var req = {
                method: 'GET',
                url: 'http://'+CONFIG.HOST+':8080/api/events/' + parseInt($scope.currentYear) + "/" + (parseInt($scope.currentMonth) - 1)
            }
            $http(req)
                .then(
                    function(data) {
                        $scope.events = data.data;
                        flushCalendar();
                        setContents();
                        $timeout(function() { $scope.isLoading = false }, 1000);

                    },
                    function(err) {
                        $mdToast.show($mdToast.simple().textContent("Errore nel recuperare gli eventi: " + (err.data || "il server non risponde")));
                    }
                );
        }


        var numFmt = function(num) {
            num = num.toString();
            if (num.length < 2) {
                num = "0" + num;
            }
            return num;
        };

        $scope.selectOptions = function() {
            flushCalendar();
            setContents();
        }


        var flushCalendar = function() {
            var date = new Date($scope.currentYear, $scope.currentMonth - 2, 1);
            var days = [];
            while (date.getMonth() == parseInt($scope.currentMonth + 1)) {
                MaterialCalendarData.setDayContent(date, " ");
                date.setDate(date.getDate() + 1);
            }
        }


        var setContents = function() {
            var eventsN = new Array();
            $scope.events.forEach(function(event) {
                if (event.visible) {
                    try {
                        eventsN[event.date][event.type] = (eventsN[event.date][event.type] || 0) + 1;
                    } catch (e) {
                        eventsN[event.date] = {};
                        eventsN[event.date][event.type] = 1;
                    }
                }
            });
            Object.keys(eventsN).forEach(function(key) {
                var html = ""
                Object.keys(eventsN[key]).forEach(function(typekey) {
                    html += "<md-button class=\"md-fab md-mini md-tiny type" + typekey + "\" aria-label=\"Events\">" + eventsN[key][typekey] + "</md-button>";
                });
                MaterialCalendarData.setDayContent(new Date(key), html);
            });
        }


        $scope.dayClick = function(date) {
            if ($rootScope.inPrenotazione)
                tplUrl = 'tpl/dayDialogPrenotazione.tpl.html';
            else
                tplUrl = 'tpl/dayDialog.tpl.html';
                
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


        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };


        $scope.prevMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
            getData();
        }


        $scope.nextMonth = function(date) {
            $scope.currentMonth = date.month;
            $scope.currentYear = date.year;
            getData();
        }
        

        getData();

    });
