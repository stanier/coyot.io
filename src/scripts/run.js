app.run([
    '$rootScope',
    '$http',
    '$location',
    '$state',
    '$cookies',
    'ServerFactory',
    function($rootScope, $http, $location, $state, $cookies, server) {
        $rootScope.path = {
            equals: function(path) {
                return path == $location.path();
            },
            startsWith: function(path) {
                return $location.path().startsWith(path);
            }
        };

        $rootScope.back = function() {
            window.history.back();
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.data.loginRequired && typeof $cookies.get('auth-token') === 'undefined') {
                event.preventDefault();

                $state.go('login');
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (!!toParams.hostname && (!fromState || toParams.hostname != fromParams.hostname)) {
                server.getStats(function(data) {
                    $rootScope.server = data;
                    $rootScope.server.uptime = new Date(data.uptime * 1000);

                    $rootScope.$broadcast('serverInfoReady');
                });
            }
        });
    }
]);
