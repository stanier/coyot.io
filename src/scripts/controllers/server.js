<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
app.controller('ServerCtlr', [
        '$scope',
        '$rootScope',
        '$http',
        '$routeParams',
        '$location',
        function($scope, $rootScope, $http, $routeParams, $location) {
<<<<<<< HEAD
=======
=======
app.controller('ServerCtlr', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
    $scope.pageSize    = 20;
    $scope.currentPage = 0;
    $scope.terminalResponse = '';
    $scope.serviceStatus = [];

    function getConnectionDetails(callback) {
<<<<<<< HEAD
        if (!$rootScope.server) {
            $http.get('/api/server/' + $routeParams.hostname + '/')
                .success(function(data, status, headers, config) {
                    $rootScope.server = data;
=======
<<<<<<< HEAD
        if (!$rootScope.server) {
            $http.get('/api/server/' + $routeParams.hostname + '/')
                .success(function(data, status, headers, config) {
                    $rootScope.server = data;
=======
        if (!$scope.global.server) {
            $http.get('/api/server/' + $routeParams.hostname + '/')
                .success(function(data, status, headers, config) {
                    $scope.$emit('serverConnection', data);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            createSocket($rootScope.server.host, $rootScope.server.port, function(socket) {
                // $scope.socket is stored in scope for garbage collection purposes
                $scope.socket = socket;

                $scope.socket.on('start service response', function(service, result) {
<<<<<<< HEAD
=======
=======
            createSocket($scope.global.server.host, $scope.global.server.port, function() {
                socket.on('start service response', function(service, result) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                    if (result == 'success') toastr.success(service + ' started successfully');
                    if (result == 'failure') toarts.error(service + ' could not be started');

                    if (!!$scope.service) $scope.getServiceInfo(service);
                    if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
                });

<<<<<<< HEAD
                $scope.socket.on('stop service response', function(service, result) {
=======
<<<<<<< HEAD
                $scope.socket.on('stop service response', function(service, result) {
=======
                socket.on('stop service response', function(service, result) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                    if (result == 'success') toastr.success(service + ' stopped successfully');
                    if (result == 'failure') toastr.error(service + ' could not be stopped');

                    if (!!$scope.service) $scope.getServiceInfo(service);
                    if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
                });

<<<<<<< HEAD
                $scope.socket.on('restart service response', function(service, result) {
=======
<<<<<<< HEAD
                $scope.socket.on('restart service response', function(service, result) {
=======
                socket.on('restart service response', function(service, result) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                    if (result == 'success') toastr.success(service + ' restarted successfully');
                    if (result == 'failure') toastr.error(service + ' could not be restarted');

                    if (!!$scope.service) $scope.getServiceInfo(service);
                    if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
                });

<<<<<<< HEAD
                $scope.socket.on('password required', function(operation, user) {
=======
<<<<<<< HEAD
                $scope.socket.on('password required', function(operation, user) {
=======
                socket.on('password required', function(operation, user) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
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
<<<<<<< HEAD
                            $scope.socket.emit('password supplied', password);
=======
<<<<<<< HEAD
                            $scope.socket.emit('password supplied', password);
=======
                            socket.emit('password supplied', password);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                        }
                    });
                });

<<<<<<< HEAD
                $scope.socket.on('stdout', function(data) {
=======
<<<<<<< HEAD
                $scope.socket.on('stdout', function(data) {
=======
                socket.on('stdout', function(data) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                    $scope.terminalResponse += data;
                    console.log('STDOUT:  ' + data);
                    $scope.$apply();
                });

<<<<<<< HEAD
                $scope.socket.on('stderr', function(data) {
=======
<<<<<<< HEAD
                $scope.socket.on('stderr', function(data) {
=======
                socket.on('stderr', function(data) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                    $scope.terminalResponse += data;
                    console.log('STDERR:  ' + data);
                    $scope.$apply();
                });

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                $scope.socket.on('error', function(data) {
                    toastr.error('data');
                });

                $scope.socket.on('service status response', function(service, status) {
<<<<<<< HEAD
=======
=======
                socket.on('error', function(data) {
                    toastr.error('data');
                });

                socket.on('service status response', function(service, status) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
                    for (var i = 0; i < $scope.serviceStatus.length; i++) {
                        if ($scope.serviceStatus[i].service == service) $scope.serviceStatus[i].isRunning = status;
                    }
                    $scope.$apply();
                });

<<<<<<< HEAD
                $scope.socket.on('service status all response', function(service, status) {
=======
<<<<<<< HEAD
                $scope.socket.on('service status all response', function(service, status) {
=======
                socket.on('service status all response', function(service, status) {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
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
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/system/stats?type=all')
=======
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/system/stats?type=all')
=======
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/system/stats?type=all')
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
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

<<<<<<< HEAD
        for (var i in $rootScope.server.loadavg) {
            var rotation = Math.floor($rootScope.server.loadavg[i] / $rootScope.server.cpu.length * 180);
=======
<<<<<<< HEAD
        for (var i in $rootScope.server.loadavg) {
            var rotation = Math.floor($rootScope.server.loadavg[i] / $rootScope.server.cpu.length * 180);
=======
        for (var i in $scope.global.server.loadavg) {
            var rotation = Math.floor($scope.global.server.loadavg[i] / $scope.global.server.cpu.length * 180);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            var fix_rotation = rotation * 2;
            for (var j in transform_styles) {
                $('#circle-'+i+' .fill, #circle-'+i+' .mask.full').css(transform_styles[j], 'rotate(' + rotation + 'deg)');
                $('#circle-'+i+' .fill.fix').css(transform_styles[j], 'rotate(' + fix_rotation + 'deg)');
            }
        }
    };

    $scope.getPkgs = function() {
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/list')
=======
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/list')
=======
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/packages/list')
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            .success(function(data, status, headers, config) {
                $scope.pkgs = data;
            })
            .error(function(data, status, headers, config) {
                $scope.pkgs = data;
            })
        ;
    };

    $scope.getPkgManagers = function() {
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/listManagers')
=======
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/listManagers')
=======
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/packages/listManagers')
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            .success(function(data, status, headers, config) {
                $scope.managers = data;
            })
            .error(function(data, status, headers, config) {
                $scope.managers = data;
            })
        ;
    };

    $scope.getPkgInfo = function(pkg) {
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/getInfo/' + pkg)
=======
<<<<<<< HEAD
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/getInfo/' + pkg)
=======
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/packages/getInfo/' + pkg)
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            .success(function(data, status, headers, config) {
                $scope.pkg = data;
            })
            .error(function(data, status, headers, config) {
                $scope.pkg = data;
            })
        ;
    };

    $scope.installPkg = function() {
<<<<<<< HEAD
        $scope.socket.emit('install package', {
=======
<<<<<<< HEAD
        $scope.socket.emit('install package', {
=======
        socket.emit('install package', {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            manager: $scope.pkgMngr,
            pkg: $scope.pkgInstallQuery
        });
    };

    $scope.updatePkg = function() {
<<<<<<< HEAD
        $scope.socket.emit('update package', {
=======
<<<<<<< HEAD
        $scope.socket.emit('update package', {
=======
        socket.emit('update package', {
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
            manager: $scope.pkgMngr,
            pkg: $scope.pkgUpdateQuery
        });
    };

    $scope.getServiceStatus = function(service) {
<<<<<<< HEAD
        $scope.socket.emit('get service status', service);
    };

    $scope.getServiceInfo = function(service) {
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/services/getInfo/' + service)
=======
<<<<<<< HEAD
        $scope.socket.emit('get service status', service);
    };

    $scope.getServiceInfo = function(service) {
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/services/getInfo/' + service)
=======
        socket.emit('get service status', service);
    };

    $scope.getServiceInfo = function(service) {
        $http.get('//' + $scope.global.server.host + ':' + $scope.global.server.port + '/api/worker/services/getInfo/' + service)
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
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
<<<<<<< HEAD
        $scope.socket.emit('get status all');
=======
<<<<<<< HEAD
        $scope.socket.emit('get status all');
=======
        socket.emit('get status all');
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
    };

    $scope.startService = function(target) {
        toastr.info('Starting service ' + target + '...');
<<<<<<< HEAD
        $scope.socket.emit('start service', target);
=======
<<<<<<< HEAD
        $scope.socket.emit('start service', target);
=======
        socket.emit('start service', target);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
    };

    $scope.stopService = function(target) {
        toastr.info('Stopping service ' + target + '...');
<<<<<<< HEAD
        $scope.socket.emit('stop service', target);
=======
<<<<<<< HEAD
        $scope.socket.emit('stop service', target);
=======
        socket.emit('stop service', target);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
    };

    $scope.restartService = function(target) {
        toastr.info('Restarting service ' + target + '...');
<<<<<<< HEAD
        $scope.socket.emit('restart service', target);
=======
<<<<<<< HEAD
        $scope.socket.emit('restart service', target);
=======
        socket.emit('restart service', target);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
    };

    $scope.sendInput = function() {
        $scope.terminalResponse += '\n';
<<<<<<< HEAD
        $scope.socket.emit('input', { input: $scope.terminalInput });
=======
<<<<<<< HEAD
        $scope.socket.emit('input', { input: $scope.terminalInput });
=======
        socket.emit('input', { input: $scope.terminalInput });
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
        $scope.terminalInput = '';
    };
}]);
