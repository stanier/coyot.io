app.controller('ServerCtlr', [
    '$q',
    '$stateParams',
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    'SocketFactory',
    function($q, $stateParams, $scope, $rootScope, $http, $location, socket) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;
        $scope.terminalResponse = '';
        $scope.serviceStatus = [];

        $scope.getPlatformClass = function(platform) {
            if (platform == 'linux')   return 'fa fa-linux';
            if (platform == 'windows') return 'fa fa-windows';
            if (platform == 'darwin')  return 'fa fa-wheelchair';
        };

        $scope.sendInput = function() {
            $scope.terminalResponse += '\n';
            socket.emit('input', { input: $scope.terminalInput });
        };

        var deferred = $q.defer();

        $http.get('/api/server/' + $stateParams.hostname + '/')
            .success(function(data, status, headers, config) {
                $http.get('//' + data.host + ':' + data.port + '/api/system/stats?type=all')
                    .success(function(data, status, headers, config) {
                        $rootScope.server = data;
                        $rootScope.server.uptime = new Date(data.uptime * 1000);
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        toastr.error(data);
                    })
                ;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        return deferred.promise;
    }
]);
