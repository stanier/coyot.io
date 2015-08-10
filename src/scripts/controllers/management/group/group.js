app.controller('GroupViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $http.get('/api/management/groups/' + $stateParams.group)
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
