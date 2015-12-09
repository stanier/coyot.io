app.controller('UserViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    'ToastFactory',
    function($scope, $http, $stateParams, toast) {
        $http.get('/api/management/users/' + $stateParams.user)
            .success(function(data, status, headers, config) {
                if (data.success) $scope.user = data.result;
                else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);
