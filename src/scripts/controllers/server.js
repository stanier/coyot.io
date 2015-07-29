app.controller('ServerCtlr', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    $scope.pageSize    = 20;
    $scope.currentPage = 0;
    $scope.terminalResponse = '';
    $scope.serviceStatus = [];

    function getConnectionDetails(callback) {
        if (!$scope.global.server) {
            $http.get('/api/server/' + $routeParams.hostname + '/')
                .success(function(data, status, headers, config) {
                    $scope.$emit('serverConnection', data);
                    callback();
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                })
            ;
        } else {
            callback();
        }
    }

    $scope.init = function(callback) {
        getConnectionDetails(function() {
            createSocket($scope.global.server.host, $scope.global.server.port, function() {
                socket.on('start service response', function(service, result) {
                    if (result == 'success') toastr.success(service + ' started successfully');
                    if (result == 'failure') toarts.error(service + ' could not be started');

                    if (!!$scope.service) $scope.getServiceInfo(service);
                    if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
                });

                socket.on('stop service response', function(service, result) {
                    if (result == 'success') toastr.success(service + ' stopped successfully');
                    if (result == 'failure') toastr.error(service + ' could not be stopped');

                    if (!!$scope.service) $scope.getServiceInfo(service);
                    if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
                });

                socket.on('restart service response', function(service, result) {
                    if (result == 'success') toastr.success(service + ' restarted successfully');
                    if (result == 'failure') toastr.error(service + ' could not be restarted');

                    if (!!$scope.service) $scope.getServiceInfo(service);
                    if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
                });

                socket.on('password required', function(operation, user) {
                    toastr.warning('Password required to ' + operation + ' with user ' + user);

                    swal({
                        title: 'Password required',
                        text: 'A password is required to complete this operation',
                        type: 'input',
                        inputType: 'password',
                        showCancelButton: true,
                        closeOnConfirm: true,
                        animation: 'slide-from-top',
                        inputPlaceholder: 'Password'
                    }, function(password){
                        if (password === false) return false;
                        else if (password === '') {
                            swal.showInputError('Password is required');
                            return false;
                        }
                        else {
                            socket.emit('password supplied', password);
                        }
                    });
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

                socket.on('service status response', function(service, status) {
                    for (var i = 0; i < $scope.serviceStatus.length; i++) {
                        if ($scope.serviceStatus[i].service == service) $scope.serviceStatus[i].isRunning = status;
                    }
                    $scope.$apply();
                });

                socket.on('service status all response', function(service, status) {
                    $scope.serviceStatus.push({
                        service: service,
                        isRunning: status
                    });
                    $scope.$apply();
                });

                callback();
            });
        });
    };

    $scope.getStats = function() {
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/system/stats?type=all')
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

        for (var i in $scope.global.server.loadavg) {
            var rotation = Math.floor($scope.global.server.loadavg[i] / $scope.global.server.cpu.length * 180);
            var fix_rotation = rotation * 2;
            for (var j in transform_styles) {
                $('#circle-'+i+' .fill, #circle-'+i+' .mask.full').css(transform_styles[j], 'rotate(' + rotation + 'deg)');
                $('#circle-'+i+' .fill.fix').css(transform_styles[j], 'rotate(' + fix_rotation + 'deg)');
            }
        }
    };

    $scope.getPkgs = function() {
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/packages/list')
            .success(function(data, status, headers, config) {
                $scope.pkgs = data;
            })
            .error(function(data, status, headers, config) {
                $scope.pkgs = data;
            })
        ;
    };

    $scope.getPkgManagers = function() {
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/packages/listManagers')
            .success(function(data, status, headers, config) {
                $scope.managers = data;
            })
            .error(function(data, status, headers, config) {
                $scope.managers = data;
            })
        ;
    };

    $scope.getPkgInfo = function(pkg) {
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/packages/getInfo/' + pkg)
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

    $scope.getServiceStatus = function(service) {
        socket.emit('get service status', service);
    };

    $scope.getServiceInfo = function(service) {
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/services/getInfo/' + service)
            .success(function(data, status, headers, config) {
                $scope.service = data;
                $scope.$apply();
            })
            .error(function(data, status, headers, config) {
                $scope.service = data;
                $scope.$apply();
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

    $scope.sendInput = function() {
        $scope.terminalResponse += '\n';
        socket.emit('input', { input: $scope.terminalInput });
        $scope.terminalInput = '';
    };
}]);
