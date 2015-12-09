app.controller('GroupViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    'ToastFactory',
    function($scope, $http, $stateParams, toast) {
        $http.get('/api/management/groups/' + $stateParams.group)
            .success(function(data, status, headers, config) {
                if (data.success) $scope.group = data.result;
                else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
            })
        ;
    }
]);
