app.controller('UserEditCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    '_',
    function($scope, $http, $stateParams, _) {
        $http.get('/api/management/users/' + $stateParams.user)
            .success(function(data, status, headers, config) {
                data.groups = _.pluck(data.groups, '_id');

                $scope.user = _.clone(data);
                $scope.carbon = _.clone(data);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $http.get('/api/management/groups')
            .success(function(data, status, headers, config) {
                $scope.groups = data;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $scope.update = function() {
            var changed = {};

            if ($scope.user.username !== $scope.carbon.username) changed.username = $scope.user.username;
            if ($scope.user.email !== $scope.carbon.email) changed.email = $scope.user.email;
            if ($scope.user.role !== $scope.carbon.role) changed.role = $scope.user.role;
            if ($scope.user.groups !== $scope.carbon.groups) changed.groups = $scope.user.groups;

            $http.put('/api/management/users/' + $stateParams.user, changed)
                .success(function(data, status, headers, config) {
                    toastr.success('User updated successfully');
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };
    }
]);
