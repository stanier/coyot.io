app.controller('UserListCtlr', [
    '$scope',
    '$http',
    'ToastFactory',
    function($scope, $http, toast) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;

        $scope.getUsers = function() {
            $http.get('/api/management/users')
                .success(function(data, status, headers, config) {
                    if (data.success) $scope.users = data.result;
                    else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
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
                toast.show('Deleting user \"' + user + '\" ...');
                $http.delete('/api/management/users/' + user)
                    .success(function(data, status, headers, config) {
                        if (data.success) {
                            toastr.success('User \"' + user + '\" deleted successfully!');
                            $scope.getUsers();
                        } else toast.error(data.error);
                    })
                    .error(function(data, status, headers, config) {
                        toast.error(data);
                    })
                ;
            });
        };
    }
]);
