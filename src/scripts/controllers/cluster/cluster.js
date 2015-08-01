app.controller('ClusterCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
        $scope.getServers = function() {
            $http.get('/api/cluster/servers')
                .success(function(data, status, headers, config) {
                    $scope.servers = [];

                    for (var i = 0; i < data.length; i++) {
                        $scope.servers[i] = {
                            hostname: data[i].hostname,
                            host    : data[i].host,
                            port    : data[i].port,
                            isWorker: data[i].type === 'hybrid' || data[i].type === 'worker',
                            isWeb   : data[i].type === 'hybrid' || data[i].type === 'web'
                        };
                        $scope.getStats(i);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                })
            ;
        };

        $scope.getStats = function(index) {
            $http.get('//' + $scope.servers[index].host + ':' + $scope.servers[index].port + '/api/system/stats?type=simple')
                .success(function(data, status, headers, config) {
                    $scope.servers[index].online  = data.online;
                    $scope.servers[index].freemem = data.freemem;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                })
            ;
        };
    }
]);
