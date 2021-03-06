app.controller('ServiceCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    '$stateParams',
    function($scope, $rootScope, $http, $stateParams) {
        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port +
            '/api/worker/services/getInfo/' + $stateParams.service)
            .success(function(data, status, headers, config) {
                $scope.service = data;
                $scope.$apply();
            })
            .error(function(data, status, headers, config) {
                $scope.service = data;
                $scope.$apply();
            })
        ;

        $scope.getServiceStatus = function(service) {
            socket.emit('get service status', service);
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
