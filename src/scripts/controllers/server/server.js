app.controller('ServerCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    'SocketFactory',
    function($scope, $rootScope, $http, $location, socket) {
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
    }
]);
