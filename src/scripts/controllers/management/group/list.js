app.controller('GroupListCtlr', [
    '$scope',
    '$http',
    'ToastFactory',
    function($scope, $http, toast) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;

        $scope.getGroups = function() {
            $http.get('/api/management/groups')
                .success(function(data, status, headers, config) {
                    if (data.success) $scope.groups = data.result;
                    else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        };

        $scope.delete = function(group) {
            swal({
                title: 'Confirm group deletion',
                text: 'You are about to delete group \"' + group + '\".  Continue?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Confirm',
                closeOnConfirm: true
            }, function(){
                toast.show('Deleting group \"' + group + '\" ...');
                $http.delete('/api/management/groups/' + group)
                    .success(function(data, status, headers, config) {
                        if (data.success) {
                            toast.success('Group \"' + group + '\" deleted successfully!');
                            $scope.getGroups();
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
