/**
 * coyot.io - An open-source cluster-ready server management solution driven by node.js and MongoDB
 * @version v0.0.1
 * @link https://github.com/stanier/coyot.io
 * @license MIT
 */
toastr.options.newestOnTop = false;
toastr.options.progressBar = false;
toastr.options.positionClass = 'toast-bottom-right';

$.material.init();
$.material.ripples();
$.material.input();
$.material.checkbox();
$.material.radio();

var app = angular.module('coyot.io', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/cluster/manage', {
            templateUrl: 'pages/cluster/manage',
            controller: 'ClusterCtlr'
        })
        .when('/management/dashboard', {
            templateUrl: 'pages/management/dashboard',
            controller: 'ManagementCtlr'
        })
        .when('/management/users', {
            templateUrl: 'pages/management/users',
            controller: 'ManagementCtlr'
        })
        .when('/server/:hostname/overview', {
            templateUrl: 'pages/server/overview',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/packages/install', {
            templateUrl: 'pages/server/packages/install',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/packages/update', {
            templateUrl: 'pages/server/packages/update',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/packages', {
            templateUrl: 'pages/server/packages',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/package/:pkg/', {
            templateUrl: 'pages/server/packages/view',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/services', {
            templateUrl: 'pages/server/services',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/service/:service/', {
            templateUrl: 'pages/server/services/view',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/processes', {
            templateUrl: 'pages/server/processes',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/process/:process', {
            templateUrl: 'pages/server/processes/view',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .otherwise({
            redirectTo: 'management/dashboard'
        })
    ;

    $locationProvider.html5Mode(true);
}]);

var socket;

function createSocket(host, port, callback) {
    socket = io('http://' + host + ':' + port);

    callback();
}

app.controller('ClusterCtlr', ['$scope', '$http', function($scope, $http) {
    $scope.getServers = function() {
        $http.get('/api/cluster/servers')
        .success(function(data, status, headers, config) {
            $scope.servers = [];

            for (var i = 0; i < data.length; i++) {
                $scope.servers[i] = {
                    hostname: data[i].hostname,
                    host    : data[i].host,
                    port    : data[i].port,
                    isWorker: data[i].type === 'hybrid' || data[i].type === 'worker',
                    isWeb   : data[i].type === 'hybrid' || data[i].type === 'web'
                };
                $scope.getStats(i);
            }
        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });
    };

    $scope.getStats = function(index) {
        $http.get('//' + $scope.servers[index].host + ':' +
            $scope.servers[index].port + '/api/system/stats?type=simple')
        .success(function(data, status, headers, config) {
            $scope.servers[index].online  = data.online;
            $scope.servers[index].freemem = data.freemem;
        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });
    };
}]);

app.controller('GeneralCtlr', ['$scope', '$location', function($scope, $location) {
    $scope.global = {};
    
    $scope.$on('serverConnection', function(event, data) {
        $scope.global.server = data;
    });

    $scope.path = {
        equals: function(path) {
            return path == $location.path();
        },
        startsWith: function(path) {
            return $location.path().startsWith(path);
        }
    };
}]);

app.controller('ManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $scope.pageSize    = 20;
    $scope.currentPage = 0;

    $scope.getUsers = function() {
        $http.get('/api/management/users')
            .success(function(data, status, headers, config) {
                $scope.users = data;
                $scope.$apply();
            })
            .error(function(data, status, headers, config) {
                $scope.users = data;
                $scope.$apply();
            })
        ;
    };
}]);

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

app.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';

        if (typeof precision == 'undefined') precision = 1;
        var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
});

app.filter('offsetBy', function() {
    return function(input, start) {
        if (!!input) {
            start = + start;
            return input.slice(start);
        }
        return [];
    };
});
