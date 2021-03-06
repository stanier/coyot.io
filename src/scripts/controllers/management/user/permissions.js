app.controller('UserPermsCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    'ToastFactory',
    function($scope, $http, $stateParams, toast) {
        $scope.selected = {};

        $scope.user = {
            name: $stateParams.user
        };

        // Get all available permissions
        $http.get('/api/management/permissions')
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.permissions = data.result;
                }
                else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
            })
        ;

        // Get active permissions for user
        $http.get('/api/management/users/' + $stateParams.user + '/permissions')
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.user.permissions = data.result;
                    console.log(data.result);
                } else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
            })
        ;

        $scope.change = function(handle) {
            if ($scope.user.permissions.indexOf(handle) > -1) {
                $http.delete('/api/management/users/' + $stateParams.user + '/permissions/' + handle);
                checkPermission(handle);
            } else {
                $http.put('/api/management/users/' + $stateParams.user + '/permissions/' + handle);
                checkPermission(handle);
            }
        };

        $scope.update = function() {
            $http.post('/api/management/users/' + $stateParams.user + '/permissions', postData)
                .success(function(data, status, headers, config) {
                    toast.success(data);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        };

        function checkPermission(handle) {
            $http.get('/api/management/users/' + $stateParams.user + '/permissions/' + handle)
                .success(function(data, status, headers, config) {
                    if (data.result === true && $scope.user.permissions.indexOf(handle) < 0)
                        $scope.user.permissions.push(handle);
                    else if (data.result === false && $scope.user.permissions.indexOf(handle) > -1)
                        $scope.user.permissions.splice($scope.user.permissions.indexOf(handle));
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                })
            ;
        }
    }
]);
