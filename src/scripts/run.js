app.run([
    '$rootScope',
    '$http',
    '$location',
    '$state',
    '$cookies',
    function($rootScope, $http, $location, $state, $cookies) {
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
    }
]);
