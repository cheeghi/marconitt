app
    .controller('SearchCtrl', function($scope, $timeout, $mdSidenav, $log, $filter, $http, MaterialCalendarData, $q, $mdToast, $mdDialog, $rootScope, CONFIG) {

        var init = function() {
            var req = {
                method: 'GET',
                url: 'http://'+CONFIG.HOST+':8080/api/who'
            }

            $http(req)
                .then(
                    function(data) {
                        $scope.whos = data.data;
                    },
                    function(err) {
                        console.log(err);
                    }
                );
        }

        init();
    });
