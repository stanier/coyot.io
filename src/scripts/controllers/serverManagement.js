angular.module('synapse').controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $http.get('/servers/list')
    .success(function(data, status, headers, config) {
        var servers = [];

        for (var i = 0; i < data.length; i++) {
            getStats(data[i]);
        }

        function getStats(hostname) {
            $http.get(hostname + '/worker/stats?simple')
            .success(function(data, status, headers, config) {
                servers[i] = data;
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
