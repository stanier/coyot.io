app.controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $scope.pageSize    = 20;
    $scope.currentPage = 0;
    $scope.terminalResponse = '';

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
            })
        ;
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
            })
        ;
    };

    $scope.getPackageManagers = function() {
        $http.get('//' + host + ':' + port + '/worker/packages/listManagers')
            .success(function(data, status, headers, config) {
                $scope.managers = data;
            })
            .error(function(data, status, headers, config) {
                $scope.managers = data;
            })
        ;
    };

    $scope.getPackageInfo = function(package) {
        $http.get('//' + host + ':' + port + '/worker/packages/getInfo/' + package)
            .success(function(data, status, headers, config) {
                $scope.package = data;
            })
            .error(function(data, status, headers, config) {
                $scope.package = data;
            });
    };

    $scope.installPackage = function() {
        socket.emit('install package', {
            manager: $scope.pkgMngr,
            package: $scope.pkgInstallQuery
        });
    };

    $scope.updatePackage = function() {
        socket.emit('update package', {
            manager: $scope.pkgMngr,
            package: $scope.pkgUpdateQuery
        });
    };

    socket.on('stdout', function(data) {
        $scope.terminalResponse += data;
        console.log('STDOUT:  ' + data);
        $scope.$apply();
    });
    socket.on('stderr', function(data) {
        $scope.terminalResponse += data;
        console.log('STDERR:  ' + data);
        $scope.$apply();
    });
    socket.on('error', function(data) {
        $scope.terminalResponse += data;
        console.log('ERROR:  ' + data);
        $scope.$apply();
    });

    $scope.sendInput = function() {
        $scope.terminalResponse += '\n';
        socket.emit('input', { input: $scope.terminalInput });
        $scope.terminalInput = '';
    };
}]);
