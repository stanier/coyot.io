app.controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $http.get('http://' + host + ':' + port + '/server/stats?type=all')
    .success(function(data, status, headers, config) {
        $scope.server = data;
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });

    $scope.getPlatformClass = function(platform) {
        if (platform == 'linux') return 'fa fa-linux';
        if (platform == 'windows') return 'fa fa-windows';
        if (platform == 'apple') return 'fa fa-wheelchair';
    };
}]);
