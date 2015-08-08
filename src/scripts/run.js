app.run([
    '$rootScope',
    '$http',
    '$location',
    '$state',
    'ServerFactory',
    function($rootScope, $http, $location, $state, server) {
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

        $rootScope.$on('$stateChangeStart', function(event, nextState, nextParams) {
            if (nextState.data.loginRequired && typeof $rootScope.user === 'undefined') {
                event.preventDefault();

                $state.go('login');
            }
        });

        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
            if (!!current.params.hostname && (!previous || current.params.hostname != previous.params.hostname)) {
                server.getStats(function(data) {
                    $rootScope.server = data;
                    $rootScope.server.uptime = new Date(data.uptime * 1000);

                    $rootScope.$broadcast('serverInfoReady');
                });
            }
        });
    }
]);
