app.controller('GroupViewCtlr', [
    '$scope',
    '$http',
    '$routeParams',
    function($scope, $http, $routeParams) {
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
