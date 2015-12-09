app.controller('ServiceListCtlr', [
    '$scope',
    '$rootScope',
    'SocketFactory',
    'ToastFactory',
    function($scope, $rootScope, socket, toast) {
        $scope.serviceStatus = [];

        socket.init($rootScope.server.host, $rootScope.server.port, function() {
            socket.on('start service response', function(service, result) {
                if (result == 'success') toast.success(service + ' started successfully');
                if (result == 'failure') toast.error(service + ' could not be started');

                if (!!$scope.service) $scope.getServiceInfo(service);
                if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
            });

            socket.on('stop service response', function(service, result) {
                if (result == 'success') toast.success(service + ' stopped successfully');
                if (result == 'failure') toast.error(service + ' could not be stopped');

                if (!!$scope.service) $scope.getServiceInfo(service);
                if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
            });

            socket.on('restart service response', function(service, result) {
                if (result == 'success') toast.success(service + ' restarted successfully');
                if (result == 'failure') toast.error(service + ' could not be restarted');

                if (!!$scope.service) $scope.getServiceInfo(service);
                if (!!$scope.serviceStatus) $scope.getServiceStatus(service);
            });

            socket.on('password required', function(operation, user) {
                toast.show('Password required to ' + operation + ' with user ' + user);

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
                toast.error('data');
            });

            socket.on('service status response', function(service, status) {
                toast.error('data');
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

            socket.emit('get status all');
        });
}]);
