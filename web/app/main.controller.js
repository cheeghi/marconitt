app
    .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $log, $filter, $http, $mdToast, CONFIG, $rootScope, $mdSidenav) {
      
        $rootScope.logged = false;
        $rootScope.token;
        $rootScope.inPrenotazione = false;
        $scope.logged = false;
        $scope.logged = $rootScope.logged;
        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.mainHtml;
        $scope.tool = 'Visualizza';
        $scope.logindata = {};
        //$scope.token;

        
        /**
        * init: checks if the session is active, if true --> logged=true
        */
        $scope.init = function() {

             //PRESUMO CHE L'INIT SIA IL MOMENTO GIUSTO IN OGNI CASO PER EFFETTUARE IL SETUP, ALTRIMENTI CAMBIA METODO
            var a = $http.get('http://'+CONFIG.HOST+':8080/setup'); //AVVIAMENTO AUTOMATICO DEL SETUP INIZIALE
            a.error(function(response) {console.log('fallisce il setup')});
            a.success(function(response) {console.log('va il setup')});

            $http.get('http://'+CONFIG.HOST+':8080/api/checklogin').success(function(response) {
                if (response.success) {
                    $rootScope.logged = true;
                    $rootScope.token = localStorage.token;
                    $rootScope.username = response.username;
                    $scope.logged = true;
                } else {
                    localStorage.token = undefined;
                }
            })
        };


        $scope.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
        };


        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope, args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }


        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                $mdSidenav(navID)
                    .toggle()
            }, 200);
        }


        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                //$log.debug("close LEFT is done");
                });
        };


        $scope.login = function() {
            //chiamata http che ritorna il token da utilizzare nelle prossime chiamate
            console.log($scope.logindata);

            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/authenticate',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "name="+$scope.logindata.name+"&password="+$scope.logindata.password
                //data: { name: 'dalbo', password: '123456--'}
            }

            $http(req)
                .then(
                      function(data) {
                          if (data.data.success) {
                              $rootScope.token = data.data.token;
                              $rootScope.logged = true;
                              $rootScope.username = data.data.username;
                              $scope.logged = true;
                              localStorage.token = data.data.token;
                              
                              $mdToast.show($mdToast.simple().textContent('Login avvenuto con successo!'));
                          } else {
                              $mdToast.show($mdToast.simple().textContent('Errore! '+data.data.message));
                          }
                      },
                      function(err) {
                          $mdToast.show($mdToast.simple().textContent('Errore di rete'));
                      }
                );
            
            $mdSidenav('left').close();
        }


        $scope.logout = function() {
            //console.log(localStorage.token);
            $http.get('http://'+CONFIG.HOST+':8080/api/logout');
            $rootScope.username = undefined;
            $rootScope.token = undefined;
            $rootScope.logged = false;
            $scope.logged = false;
            localStorage.token = undefined;
            $rootScope.inPrenotazione = false; $scope.setView('Visualizza');
        }


        $scope.view = function(e, inPrenotazione) {
            $rootScope.inPrenotazione = inPrenotazione;
            //console.log(localStorage.token);
            $mdSidenav('left').close();
            $scope.setView(e);
        }


        $scope.setView = function(viewName) {
            if ($rootScope.inPrenotazione != undefined && $rootScope.inPrenotazione)
                $scope.tool = "Prenota";
            else
                $scope.tool = viewName;

            tpl = $filter('lowercase')(viewName);
            $http
                .get('tpl/'+tpl+'.tpl.html')
                    .then(
                        function(res) {
                            //console.log(res.data);
                            $scope.mainHtml = res.data;
                        }, function(err) {
                            console.log(err);
                        }
                    );
        }

        // on start
        $scope.setView('Visualizza');
    });
