app.controller('ClusterManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $http.get('/cluster/list')
    .success(function(data, status, headers, config) {
        $scope.servers = [];

        for (var i = 0; i < data.length; i++) {
            $scope.servers[i] = {
                hostname: data[i].hostname,
                host: data[i].host,
                port: data[i].port,
                isWorker: data[i].type == 'hybrid' || data[i].type == 'worker',
                isWeb: data[i].type === 'hybrid' || data[i].type == 'web'
            };
            getStats(i);
        }

        function getStats(i) {
            $http.get('http://' + $scope.servers[i].host + ':' +
                $scope.servers[i].port + '/server/stats?type=simple')
            .success(function(data, status, headers, config) {
                $scope.servers[i].online = data.online;
                $scope.servers[i].freemem = data.freemem;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
        }
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });
}]);
