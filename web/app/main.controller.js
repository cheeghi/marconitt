app
    .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $log, $filter, $http, $mdToast, CONFIG, $rootScope) {
      
        $rootScope.logged;
        $rootScope.admin;
        $scope.admin;
        $scope.logged;
        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.mainHtml;
        $scope.logindata = {};
        $scope.customStyle = {};
        $rootScope.loadingTime = 300; // loading circle time
        $scope.isLoading;
        $rootScope.giorniLimite = 14; // range di prenotazione per un professore


        /**
         * initialize method
         */
        $scope.init = function() {
            $scope.verifyToken();
            //PRESUMO CHE L'INIT SIA IL MOMENTO GIUSTO IN OGNI CASO PER EFFETTUARE IL SETUP, ALTRIMENTI CAMBIA METODO
            var a = $http.get('http://'+CONFIG.HOST+':8080/setup'); //AVVIAMENTO AUTOMATICO DEL SETUP INIZIALE
            a.error(function(response) {console.log('fallisce il setup')});
            a.success(function(response) {console.log('va il setup')});
        };


        /**
        * checkLogin: if session is active --> logged = true
        */
        $scope.verifyToken = function() {
            $http.get('http://'+CONFIG.HOST+':8080/api/verifyToken', {
                params: {
                    token: sessionStorage.token
                }
            }).success(function(response) {
                if (response.success) {
                    $rootScope.logged = true;
                    $scope.logged = true;
                    $rootScope.admin = response.admin;
                    $scope.admin = response.admin;
                    $rootScope.username = response.admin ? 'admin' : response.username;

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
            $scope.isLoading = true;
            
            //chiamata http che ritorna il token da utilizzare nelle prossime chiamate
            var req = {
                method: 'POST',
                url: 'http://'+CONFIG.HOST+':8080/api/authenticate',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: "name="+$scope.logindata.name+"&password="+$scope.logindata.password
            };

            $http(req)
                .then(
                    function(data) {
                        $scope.isLoading = false;
                        if (data.data.success) {
                            sessionStorage.token = data.data.token;
                            $rootScope.admin = data.data.admin;
                            $scope.admin = data.data.admin;
                            $rootScope.logged = true;
                            $scope.logged = true;
                            $rootScope.username = data.data.admin ? 'admin' : data.data.username;

                            $mdToast.show($mdToast.simple().textContent('Login avvenuto con successo!'));
                            $scope.highlight(1);
                          } else {
                              $mdToast.show($mdToast.simple().textContent('Errore! '+data.data.message));
                          }
                      },
                      function(err) {
                          $scope.isLoading = false;
                          $mdToast.show($mdToast.simple().textContent('Errore di rete!'));
                      }
                );
            
            //$mdSidenav('left').close();
        }


        /**
         * performs logout
         */
        $scope.logout = function() {
            sessionStorage.token = undefined;
            $rootScope.logged = false;
            $scope.logged = false;
            $scope.highlight(2);
            $scope.setView('calendario/calendariovisualizza');
        }


        /**
         * closes side bar and calls setView method
         */
        $scope.view = function(tplName) {
            $mdSidenav('left').close();
            $scope.setView(tplName);
        }


        /**
         * sets the view (the middle content of the page)
         */
        $scope.setView = function(tplName) {
            $scope.cambiaSchermata = true;
           
            $http
                .get('tpl/'+tplName+'.tpl.html')
                    .then(
                        function(res) {
                            $scope.mainHtml = res.data;
                            $scope.cambiaSchermata = false;
                        }, function(err) {
                            $mdToast.show($mdToast.simple().textContent('Errore!'));
                        }
                    );
        }


        /**
         * highlights selected option of side bar
         */
        $scope.highlight = function(type) {
            switch (type) {
                case 1:
                    $scope.customStyle.prenota = {"background-color" : "white"};
                    $scope.customStyle.prenotaText = {"color" : "black"};
                    $scope.customStyle.lmp = {"background-color" : "white"};
                    $scope.customStyle.lmpText = {"color" : "black"};
                    $scope.customStyle.eventi = {"background-color" : "white"};
                    $scope.customStyle.eventiText = {"color" : "black"}; 
                    $scope.customStyle.liberarisorse = {"background-color" : "white"};
                    $scope.customStyle.liberarisorseText = {"color" : "black"};
                    $scope.customStyle.visualizza = {"background-color" : "#2196F3"};
                    $scope.customStyle.visualizzaText = {"color" : "white"};                    
                    break;
                case 2:
                    $scope.customStyle.visualizza = {"background-color" : "white"};
                    $scope.customStyle.visualizzaText = {"color" : "black"};
                    $scope.customStyle.lmp = {"background-color" : "white"};
                    $scope.customStyle.lmpText = {"color" : "black"};
                    $scope.customStyle.eventi = {"background-color" : "white"};
                    $scope.customStyle.eventiText = {"color" : "black"}; 
                    $scope.customStyle.liberarisorse = {"background-color" : "white"};
                    $scope.customStyle.liberarisorseText = {"color" : "black"};                    
                    $scope.customStyle.prenota = {"background-color" : "#2196F3"};
                    $scope.customStyle.prenotaText = {"color" : "white"}; 
                    break;
                case 3:
                    $scope.customStyle.visualizza = {"background-color" : "white"};
                    $scope.customStyle.visualizzaText = {"color" : "black"};
                    $scope.customStyle.prenota = {"background-color" : "white"};
                    $scope.customStyle.prenotaText = {"color" : "black"};
                    $scope.customStyle.eventi = {"background-color" : "white"};
                    $scope.customStyle.eventiText = {"color" : "black"};
                    $scope.customStyle.liberarisorse = {"background-color" : "white"};
                    $scope.customStyle.liberarisorseText = {"color" : "black"};  
                    $scope.customStyle.lmp = {"background-color" : "#2196F3"};
                    $scope.customStyle.lmpText = {"color" : "white"};                    
                    break;
                case 4:
                    $scope.customStyle.visualizza = {"background-color" : "white"};
                    $scope.customStyle.visualizzaText = {"color" : "black"};
                    $scope.customStyle.prenota = {"background-color" : "white"};
                    $scope.customStyle.prenotaText = {"color" : "black"};
                    $scope.customStyle.lmp = {"background-color" : "white"};
                    $scope.customStyle.lmpText = {"color" : "black"};
                    $scope.customStyle.liberarisorse = {"background-color" : "white"};
                    $scope.customStyle.liberarisorseText = {"color" : "black"};
                    $scope.customStyle.eventi = {"background-color" : "#2196F3"};
                    $scope.customStyle.eventiText = {"color" : "white"}; 
                    break;
                case 5:
                    $scope.customStyle.visualizza = {"background-color" : "white"};
                    $scope.customStyle.visualizzaText = {"color" : "black"};
                    $scope.customStyle.prenota = {"background-color" : "white"};
                    $scope.customStyle.prenotaText = {"color" : "black"};
                    $scope.customStyle.lmp = {"background-color" : "white"};
                    $scope.customStyle.lmpText = {"color" : "black"};
                    $scope.customStyle.eventi = {"background-color" : "white"};
                    $scope.customStyle.eventiText = {"color" : "black"}; 
                    $scope.customStyle.liberarisorse = {"background-color" : "#2196F3"};
                    $scope.customStyle.liberarisorseText = {"color" : "white"}; 
                    break;    
            }
        };


        // on start
        $scope.setView('calendario/calendariovisualizza');
    });
