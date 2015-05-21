/**
 * synapsejs - An open-source cluster-ready server management solution driven by node.js and MongoDB
 * @version v0.0.1
 * @link http://github.com/stanier/synapse
 * @license MIT
 */
var app = angular.module('synapse', []);

app.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';

        if (typeof precision == 'undefined') precision = 1;
        var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
});

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
