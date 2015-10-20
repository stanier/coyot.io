app.controller('GroupPermsCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $scope.selected = {};

        $scope.group = {
            name: $stateParams.group
        };

        // Get all available permissions
        $http.get('/api/management/permissions')
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.categories = data.result;
                }
                else toastr.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        // Get active permissions for group
        $http.get('/api/management/groups/' + $stateParams.group + '/permissions')
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.group.permissions = data.result;
                } else toastr.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $scope.change = function(handle) {
            if ($scope.group.permissions.indexOf(handle) > -1) {
                $http.delete('/api/management/groups/' + $stateParams.group + '/permissions/' + handle);
                checkPermission(handle);
            } else {
                $http.put('/api/management/groups/' + $stateParams.group + '/permissions/' + handle);
                checkPermission(handle);
            }

            console.log($scope.group.permissions);
        };

        $scope.update = function() {
            $http.post('/api/management/groups/' + $stateparams.group + '/permissions', postData)
                .success(function(data, status, headers, config) {
                    toastr.success(data);
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };

        function checkPermission(handle) {
            $http.get('/api/management/groups/' + $stateParams.group + '/permissions/' + handle)
                .success(function(data, status, headers, config) {
                    if (data.result === true && $scope.group.permissions.indexOf(handle) < 0)
                        $scope.group.permissions.push(handle);
                    else if (data.result === false && $scope.group.permissions.indexOf(handle) > -1)
                        $scope.group.permissions.splice($scope.group.permissions.indexOf(handle));
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                })
            ;
        }
    }
]);
