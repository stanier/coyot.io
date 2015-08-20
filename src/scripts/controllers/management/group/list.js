app.controller('GroupListCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;

        $scope.getGroups = function() {
            $http.get('/api/management/groups')
                .success(function(data, status, headers, config) {
                    if (data.success) $scope.groups = data.result;
                    else toastr.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
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
                toastr.info('Deleting group \"' + group + '\" ...');
                $http.delete('/api/management/groups/' + group)
                    .success(function(data, status, headers, config) {
                        if (data.success) {
                            toastr.success('Group \"' + group + '\" deleted successfully!');
                            $scope.getGroups();
                        } else toastr.error(data.error);
                    })
                    .error(function(data, status, headers, config) {
                        toastr.error(data);
                    })
                ;
            });
        };
    }
]);
