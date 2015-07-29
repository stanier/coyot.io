app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.path = {
        equals: function(path) {
            return path == $location.path();
        },
        startsWith: function(path) {
            return $location.path().startsWith(path);
        }
    };
}]);
