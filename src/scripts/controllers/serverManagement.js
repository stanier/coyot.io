app.controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $scope.pageSize    = 20;
    $scope.currentPage = 0;
    $scope.terminalResponse = '';
    $scope.serviceStatus = [];

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

    $scope.getPkgs = function() {
        $http.get('//' + host + ':' + port + '/worker/packages/list')
            .success(function(data, status, headers, config) {
                $scope.pkgs = data;
            })
            .error(function(data, status, headers, config) {
                $scope.pkgs = data;
            })
        ;
    };

    $scope.getPkgManagers = function() {
        $http.get('//' + host + ':' + port + '/worker/packages/listManagers')
            .success(function(data, status, headers, config) {
                $scope.managers = data;
            })
            .error(function(data, status, headers, config) {
                $scope.managers = data;
            })
        ;
    };

    $scope.getPkgInfo = function(pkg) {
        $http.get('//' + host + ':' + port + '/worker/packages/getInfo/' + pkg)
            .success(function(data, status, headers, config) {
                $scope.pkg = data;
            })
            .error(function(data, status, headers, config) {
                $scope.pkg = data;
            })
        ;
    };

    $scope.installPkg = function() {
        socket.emit('install package', {
            manager: $scope.pkgMngr,
            pkg: $scope.pkgInstallQuery
        });
    };

    $scope.updatePkg = function() {
        socket.emit('update package', {
            manager: $scope.pkgMngr,
            pkg: $scope.pkgUpdateQuery
        });
    };

    $scope.getServices = function() {
        $http.get('//' + host + ':' + port + '/worker/services/list')
            .success(function(data, status, headers, config) {
                $scope.services = data;
            })
            .error(function(data, status, headers, config) {
                $scope.services = data;
            })
        ;
    };

    $scope.getServiceInfo = function(service) {
        $http.get('//' + host + ':' + port + '/worker/services/getInfo/' + service)
            .success(function(data, status, headers, config) {
                $scope.service = data;
            })
            .error(function(data, status, headers, config) {
                $scope.service = data;
            })
        ;
    };

    $scope.getRunningServices = function() {
        socket.emit('get status all');
    };

    $scope.startService = function(target) {
        toastr.info('Starting service ' + target + '...');
        socket.emit('start service', target);
    };

    $scope.stopService = function(target) {
        toastr.info('Stopping service ' + target + '...');
        socket.emit('stop service', target);
    };

    $scope.restartService = function(target) {
        toastr.info('Restarting service ' + target + '...');
        socket.emit('restart service', target);
    };

    socket.on('start service result', function(service, result) {
        if (result == 'success') toastr.success(service + ' started successfully');
        if (result == 'failure') toarts.error(service + ' could not be started');
    });

    socket.on('stop service result', function(service, result) {
        if (result == 'success') toastr.success(service + ' stopped successfully');
        if (result == 'failure') toastr.error(service + ' could not be stopped');
    });

    socket.on('restart service result', function(service, result) {
        if (result == 'success') toastr.success(service + ' restarted successfully');
        if (result == 'failure') toastr.error(service + ' could not be restarted');
    });

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
        toastr.error('data');
    });

    socket.on('service status', function(service, status) {
        $scope.serviceStatus.push({
            service: service,
            isRunning: status
        });
        $scope.$apply();
    });

    $scope.sendInput = function() {
        $scope.terminalResponse += '\n';
        socket.emit('input', { input: $scope.terminalInput });
        $scope.terminalInput = '';
    };
}]);
