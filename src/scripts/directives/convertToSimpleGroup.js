app.directive('convertToSimpleGroup', [
    '$http',
    function($http) {
        return {
            link: function(scope, element, attrs) {
                $http.get('/api/management/groups/' + scope.group)
                    .success(function(data, status, headers, config) {
                        scope.group = data;
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        toastr.error(data);
                    })
                ;
            }
        };
    }
]);
