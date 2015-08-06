app.controller('GroupListCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;

        $scope.getGroups = function() {
            $http.get('/api/management/groups')
                .success(function(data, status, headers, config) {
                    $scope.groups = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.groups = data;
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
                        toastr.success('Group \"' + group + '\" deleted successfully!');
                        $scope.getGroups();
                    })
                    .error(function(data, status, headers, config) {
                        toastr.error(data);
                    })
                ;
            });
        };
    }
]);
