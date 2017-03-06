app
  .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $log, $filter, $http, $mdToast, CONFIG, $rootScope, $mdSidenav) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.logged = false;
    $rootScope.logged = $scope.logged;
    $scope.mainHtml;
    $scope.tool = 'Visualizza';
    $scope.logindata = {};
    $rootScope.inPrenotazione = false;

    $scope.init = function() {
      if (localStorage.token != "undefined") {
        $scope.logged = true;
        $rootScope.logged = true;
        $scope.token = localStorage.token;
        $rootScope.token = localStorage.token;
      }
    };

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
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
        function(data){
          if (data.data.success) {
            localStorage.token = data.data.token;
            
            $mdToast.show($mdToast.simple().textContent('Login avvenuto con successo!'));
            $scope.token = data.data.token;
            $rootScope.token = data.data.token;
            $scope.logged = true;
            $rootScope.logged = true;
          } else {
            $mdToast.show($mdToast.simple().textContent('Errore! '+data.data.message));
          }
        },
        function(err){
          $mdToast.show($mdToast.simple().textContent('Errore di rete'));
        }
      );
      
    }
    $scope.logout = function() {
      //console.log(localStorage.token);
      $scope.token = undefined;
      $scope.logged = false;
      $rootScope.token = undefined;
      $rootScope.logged = false;
      localStorage.token = undefined;
  		$scope.setView('Visualizza');
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
          },
          function(err) {
            console.log(err);
          }
        )
    }

    // on start
    $scope.setView('Visualizza');
  });