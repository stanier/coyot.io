app.controller('GroupEditCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    '_',
    function($scope, $http, $stateParams, _) {
        $http.get('/api/management/groups/' + $stateParams.group)
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.carbon = _.clone(data.result);

                    $scope.group = _.clone(data.result);
                } else toastr.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $scope.update = function() {
            var changed = {};

            if ($scope.group.name !== $scope.carbon.name) changed.name = $scope.group.name;
            if ($scope.group.owner !== $scope.carbon.owner) changed.owner = $scope.group.owner;
            if ($scope.group.description !== $scope.carbon.description) changed.description = $scope.group.description;

            $http.put('/api/management/groups/' + $stateParams.group, changed)
                .success(function(data, status, headers, config) {
                    if (data.success) toastr.success('Group updated successfully');
                    else toastr.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };
    }
]);
