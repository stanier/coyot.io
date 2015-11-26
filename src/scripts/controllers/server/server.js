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

        $scope.getStats = function() {
            $scope.loadAvg();
        };

        $scope.getPlatformClass = function(platform) {
            if (platform == 'linux')   return 'fa fa-linux';
            if (platform == 'windows') return 'fa fa-windows';
            if (platform == 'darwin')  return 'fa fa-wheelchair';
        };

        $scope.loadAvg = function() {
            var transform_styles = [
                '-webkit-transform',
                '-ms-transform'
            ];

            console.log('hello world');
            console.log($rootScope.server.loadavg[0]);

            for (var i in $rootScope.server.loadavg) {
                var rotation = Math.floor($rootScope.server.loadavg[i] / $rootScope.server.cpu.length * 180);
                var fix_rotation = rotation * 2;

                /*for (var j in transform_styles) {
                    $('#circle-'+i+' .fill, #circle-'+i+' .mask.full').css(transform_styles[j], 'rotate(' + rotation + 'deg)');
                    $('#circle-'+i+' .fill.fix').css(transform_styles[j], 'rotate(' + fix_rotation + 'deg)');
                }*/
            }
        };

        $scope.sendInput = function() {
            $scope.terminalResponse += '\n';
            socket.emit('input', { input: $scope.terminalInput });
        };
    }
]);
