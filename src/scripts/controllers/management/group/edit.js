app.controller('GroupEditCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    'ToastFactory',
    '_',
    function($scope, $http, $stateParams, toast, _) {
        $http.get('/api/management/groups/' + $stateParams.group)
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.carbon = _.clone(data.result);

                    $scope.group = _.clone(data.result);

                    getPermissions();
                } else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
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
                    else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        };

        function getPermissions() {
            // Get all available permissions
            $http.get('/api/management/permissions')
                .success(function(data, status, headers, config) {
                    if (data.success) $scope.permissionscategories = data.result;
                    else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;

            // Get active permissions for group
            $http.get('/api/management/groups/' + $stateParams.group + '/permissions')
                .success(function(data, status, headers, config) {
                    if (data.success) {
                        $scope.group.permissions = data.result;
                    } else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        }
    }
]);
