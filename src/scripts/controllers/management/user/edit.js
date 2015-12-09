app.controller('UserEditCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    'ToastFactory',
    '_',
    function($scope, $http, $stateParams, toast, _) {
        $http.get('/api/management/users/' + $stateParams.user)
            .success(function(data, status, headers, config) {
                if (data.success) {
                    data.result.groups = _.pluck(data.groups, '_id');

                    $scope.user = _.clone(data.result);
                    $scope.carbon = _.clone(data.result);
                } else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
            })
        ;

        $http.get('/api/management/groups')
            .success(function(data, status, headers, config) {
                if (data.success) $scope.groups = data.result;
                else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
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
                    if (data.success) toast.success('User updated successfully');
                    else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        };
    }
]);
