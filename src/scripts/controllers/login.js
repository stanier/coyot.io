app.controller('LoginCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    '$state',
    '$cookies',
    function($scope, $rootScope, $http, $state, $cookies) {
        $scope.login = function() {
            $http.post('/auth/login', {
                username: $scope.username,
                password: $scope.password,
                remember: $scope.remember
            })
                .success(function(data, status, headers, config) {
                    $cookies.put('auth-token', data.token);
                    $state.go('app.management.dashboard');
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };
    }
]);
