app.controller('ServerManagementCtlr', ['$scope', '$http', function($scope, $http) {
    $http.get('http://' + host + ':' + port + '/system/stats?type=all')
    .success(function(data, status, headers, config) {
        $scope.server = data;

        $scope.server.uptime = new Date(data.uptime * 1000);

        $scope.loadAvg();
    })
    .error(function(data, status, headers, config) {
        console.log(data);
    });

    $scope.getPlatformClass = function(platform) {
        if (platform == 'linux') return 'fa fa-linux';
        if (platform == 'windows') return 'fa fa-windows';
        if (platform == 'apple') return 'fa fa-wheelchair';
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
}]);
