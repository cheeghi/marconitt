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
        $scope.customStyle = {};
        //$scope.token;


        /**
         * initialize method
         */
        $scope.init = function() {
            $scope.checkLogin();
            //PRESUMO CHE L'INIT SIA IL MOMENTO GIUSTO IN OGNI CASO PER EFFETTUARE IL SETUP, ALTRIMENTI CAMBIA METODO
            var a = $http.get('http://'+CONFIG.HOST+':8080/setup'); //AVVIAMENTO AUTOMATICO DEL SETUP INIZIALE
            a.error(function(response) {console.log('fallisce il setup')});
            a.success(function(response) {console.log('va il setup')});
        };


        /**
        * checkLogin: if session is active --> logged = true
        */
        $scope.checkLogin = function() {
            $http.get('http://'+CONFIG.HOST+':8080/api/checklogin').success(function(response) {
                if (response.success) {
                    $rootScope.logged = true;
                    $rootScope.token = response.token;
                    $rootScope.username = response.username;
                    $rootScope.admin = response.admin;
                    $scope.logged = true;
                    $scope.highlight(1);
                }
            })
        };


        /**
         * says if side bar is open or not
         */
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


        /**
         * closes side bar
         */
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                //$log.debug("close LEFT is done");
                });
        };


        /**
         * performs login
         */
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
                              $rootScope.username = data.data.username;
                              $rootScope.admin = data.data.admin;
                              $rootScope.logged = true;
                              $scope.logged = true;
                              $mdToast.show($mdToast.simple().textContent('Login avvenuto con successo!'));
                              $scope.highlight(1);
                          } else {
                              $mdToast.show($mdToast.simple().textContent('Errore! '+data.data.message));
                          }
                      },
                      function(err) {
                          $mdToast.show($mdToast.simple().textContent('Errore di rete'));
                      }
                );
            
            //$mdSidenav('left').close();
        }


        /**
         * performs logout
         */
        $scope.logout = function() {
            $scope.highlight(2);
            $http.get('http://'+CONFIG.HOST+':8080/api/logout');
            $rootScope.username = undefined;
            $rootScope.token = undefined;
            $rootScope.logged = false;
            $scope.logged = false;
            $scope.setInPrenotazione(false);
            $scope.setView('calendario', 'Visualizza');
        }


        /**
         * closes side bar and calls setView method
         */
        $scope.view = function(tplName, viewName) {
            $mdSidenav('left').close();
            $scope.setView(tplName, viewName);
        }


        /**
         * because 'Visualizza' and 'Prenota' share the same template (calendario.tpl.html) we need 
         * to know which of them the user has selected
         */
        $scope.setInPrenotazione = function(inPrenotazione) {
            $rootScope.inPrenotazione = inPrenotazione;
        };


        /**
         * sets the view (the middle content of the page)
         */
        $scope.setView = function(tplName, viewName) {
            
            $scope.tool = viewName;

            $http
                .get('tpl/'+tplName+'.tpl.html')
                    .then(
                        function(res) {
                            //console.log(res.data);
                            $scope.mainHtml = res.data;
                        }, function(err) {
                            console.log(err);
                        }
                    );
        }


        /**
         * highlight selected option of side bar
         */
        $scope.highlight = function(type) {
            if ($scope.logged) {
                if (type == 1) {
                    $scope.customStyle.visualizza = {"background-color" : "#2196F3"};
                    $scope.customStyle.visualizzaText = {"color" : "white"};
                    $scope.customStyle.prenota = {"background-color" : "white"};
                    $scope.customStyle.prenotaText = {"color" : "black"};
                    $scope.customStyle.lmp = {"background-color" : "white"};
                    $scope.customStyle.lmpText = {"color" : "black"};
                } else if (type == 2) {
                    $scope.customStyle.visualizza = {"background-color" : "white"};
                    $scope.customStyle.visualizzaText = {"color" : "black"};
                    $scope.customStyle.prenota = {"background-color" : "#2196F3"};
                    $scope.customStyle.prenotaText = {"color" : "white"};
                    $scope.customStyle.lmp = {"background-color" : "white"};
                    $scope.customStyle.lmpText = {"color" : "black"};                
                } else if (type == 3) {
                    $scope.customStyle.visualizza = {"background-color" : "white"};
                    $scope.customStyle.visualizzaText = {"color" : "black"};
                    $scope.customStyle.prenota = {"background-color" : "white"};
                    $scope.customStyle.prenotaText = {"color" : "black"};
                    $scope.customStyle.lmp = {"background-color" : "#2196F3"};
                    $scope.customStyle.lmpText = {"color" : "white"};  
                }
            }
        };


        // on start
        $scope.setView('calendario', 'Visualizza');
        $scope.setInPrenotazione(false);
    });
