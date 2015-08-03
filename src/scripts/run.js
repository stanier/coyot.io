app.run([
    '$rootScope',
    '$location',
    'ServerFactory',
    function($rootScope, $location, server) {
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
