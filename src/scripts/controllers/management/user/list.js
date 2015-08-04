app.controller('UserListCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;


        $scope.getUsers = function() {
            $http.get('/api/management/users')
                .success(function(data, status, headers, config) {
                    $scope.users = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.users = data;
                })
            ;
        };

        $scope.delete = function(user) {
            swal({
                title: 'Confirm user deletion',
                text: 'You are about to delete user + \"' + user + '\".  Continue?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Confirm',
                closeOnConfirm: true
            }, function(){
                toastr.info('Deleting user \"' + user + '\" ...');
                $http.delete('/api/management/users/' + user)
                    .success(function(data, status, headers, config) {
                        toastr.success('User \"' + user + '\" deleted successfully!');
                        $scope.getUsers();
                    })
                    .error(function(data, status, headers, config) {
                        toastr.error(data);
                    })
                ;
            });
        };
    }
]);
