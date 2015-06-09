app.controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $scope.pageSize    = 20;
    $scope.currentPage = 0;
    $scope.installerResponse = '';

    var socket = io('http://' + host + ':' + port);

    $scope.getStats = function() {
        $http.get('//' + host + ':' + port + '/system/stats?type=all')
            .success(function(data, status, headers, config) {
                $scope.server = data;

                $scope.server.uptime = new Date(data.uptime * 1000);

                $scope.loadAvg();
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
    };

    $scope.getPlatformClass = function(platform) {
        if (platform == 'linux')   return 'fa fa-linux';
        if (platform == 'windows') return 'fa fa-windows';
        if (platform == 'apple')   return 'fa fa-wheelchair';
    };

    $scope.loadAvg = function() {
        var transform_styles = ['-webkit-transform',
            '-ms-transform'];

        for (var i in $scope.server.loadavg) {
            var rotation = Math.floor($scope.server.loadavg[i] / $scope.server.cpu.length * 180);
            var fix_rotation = rotation * 2;
            for (var j in transform_styles) {
                $('#circle-'+i+' .fill, #circle-'+i+' .mask.full').css(transform_styles[j], 'rotate(' + rotation + 'deg)');
                $('#circle-'+i+' .fill.fix').css(transform_styles[j], 'rotate(' + fix_rotation + 'deg)');
            }
        }
    };

    $scope.getPackages = function() {
        $http.get('//' + host + ':' + port + '/worker/packages/list')
            .success(function(data, status, headers, config) {
                $scope.packages = data;
            })
            .error(function(data, status, headers, config) {
                $scope.packages = data;
            });
    };

    $scope.getPackageManagers = function() {
        $http.get('//' + host + ':' + 9000 + '/worker/packages/listManagers')
            .success(function(data, status, headers, config) {
                $scope.managers = data;
            })
            .error(function(data, status, headers, config) {
                $scope.managers = data;
            });
    };

    $scope.installPackage = function() {
        socket.emit('install package', {
            manager: $scope.pkgMngr,
            package: $scope.pkgInslQuery
        });
    };

    socket.on('stdout', function(data) {
        $scope.installerResponse += data;
        console.log('STDOUT:  ' + data);
        $scope.$apply();
    });
    socket.on('stderr', function(data) {
        $scope.installerResponse += data;
        console.log('STDERR:  ' + data);
        $scope.$apply();
    });
    socket.on('error', function(data) {
        $scope.installerResponse += data;
        console.log('ERROR:  ' + data);
        $scope.$apply();
    });

    $scope.sendInput = function() {
        $scope.installerResponse += '\n';
        socket.emit('input', { input: $scope.installerInput });
        $scope.installerInput = '';
    };
}]);
