app.controller('LoginCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    '$state',
    function($scope, $rootScope, $http, $state) {
        $scope.login = function() {
            $http.post('/auth/login', {
                username: $scope.username,
                password: $scope.password,
                remember: $scope.remember
            })
                .success(function(data, status, headers, config) {
                    $rootScope.user = data;
                    console.log(data);
                    $state.go('app.management.dashboard');
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };
    }
]);
