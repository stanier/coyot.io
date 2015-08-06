app.controller('GroupViewCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
        $http.get('/api/management/groups/' + $routeParams.group)
            .success(function(data, status, headers, config) {
                $scope.name = data.name;
                $scope.owner = data.owner;
                $scope.description = data.description;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);
