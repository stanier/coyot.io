app.controller('GroupPermsCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $scope.group = {
            name: $stateParams.group
        };

        // Get all available permissions
        $http.get('/api/management/permissions')
            .success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.categories = data.result;
                    console.log(data.result);
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
                    console.log(data.result);
                } else toastr.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $scope.update = function() {

        };
    }
]);
