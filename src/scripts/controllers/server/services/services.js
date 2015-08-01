app.controller('ServiceCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($scope, $rootScope, $http) {
        $scope.getServiceInfo = function(service) {
            $http.get('//' + $rootScrope.server.host + ':' + $rootScope.server.port + '/api/worker/services/getInfo/' + service)
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

        $scope.getServiceStatus = function(service) {
            socket.emit('get service status', service);
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
    }
]);
