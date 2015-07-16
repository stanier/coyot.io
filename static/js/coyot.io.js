/**
 * coyot.io - An open-source cluster-ready server management solution driven by node.js and MongoDB
 * @version v0.0.1
 * @link https://github.com/stanier/coyot.io
 * @license MIT
 */
var app = angular.module('coyot.io', []);

app.controller('ClusterManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $http.get('/cluster/list')
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
            getStats(i);
        }

        function getStats(i) {
            $http.get('//' + $scope.servers[i].host + ':' +
                $scope.servers[i].port + '/system/stats?type=simple')
            .success(function(data, status, headers, config) {
                $scope.servers[i].online  = data.online;
                $scope.servers[i].freemem = data.freemem;
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
            });
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
        start = +start;
        return input.slice(start);
    };
});
