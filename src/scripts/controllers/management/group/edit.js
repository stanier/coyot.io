app.controller('GroupEditCtlr', [
    '$scope',
    '$http',
    function($scope, $http, $routeParams) {
        $http.get('/api/management/groups/' + $routeParams.group)
            .success(function(data, status, headers, config) {
                $scope.carbon = data;

                $scope.name = data.name;
                $scope.owner = data.owner;
                $scope.description = data.description;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $scope.update = function() {
            var changed = {};

            if ($scope.name !== $scope.carbon.name) changed.name = $scope.name;
            if ($scope.owner !== $scope.carbon.owner) changed.owner = $scope.owner;
            if ($scope.description !== $scope.carbon.description) changed.description = $scope.description;

            $http.put('/api/management/groups/' + $routeParams.group, changed)
                .success(function(data, status, headers, config) {
                    toastr.success('Group updated successfully');
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };
    }
]);
