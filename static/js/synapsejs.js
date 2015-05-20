/**
 * synapsejs - An open-source cluster-ready server management solution driven by node.js and MongoDB
 * @version v0.0.1
 * @link http://github.com/stanier/synapse
 * @license MIT
 */
angular.module('synapse', []);

angular.module('synapse').controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $http.get('/servers/list')
    .success(function(data, status, headers, config) {
        $scope.servers = [];

        for (var i = 0; i < data.length; i++) {
            $scope.servers[i] = {
                hostname: data[i].hostname,
                host: data[i].host,
                port: data[i].port,
                type: data[i].type
            };
            getStats(i);
        }

        function getStats(i) {
            $http.get('http://' + $scope.servers[i].host + ':' +
                $scope.servers[i].port + '/server/stats')
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
