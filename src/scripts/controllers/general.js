app.controller('GeneralCtlr', ['$scope', '$location', function($scope, $location) {
    $scope.global = {};
    
    $scope.$on('serverConnection', function(event, data) {
        $scope.global.server = data;
    });

    $scope.path = {
        equals: function(path) {
            return path == $location.path();
        },
        startsWith: function(path) {
            return $location.path().startsWith(path);
        }
    };
}]);
