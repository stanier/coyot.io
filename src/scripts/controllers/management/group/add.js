app.controller('GroupAddCtlr', [
    '$scope',
    '$http',
    'ToastFactory',
    function($scope, $http, toast) {
        $scope.fields = {
            name: {
                name: 'Name',
                post: true,
                required: true
            },
            owner: {
                name: 'Owner',
                post: true,
                required: false
            },
            isDefault: {
                name: 'Default Group',
                post: true,
                required: false
            },
            description: {
                name: 'Description',
                post: true,
                required: false
            }
        };

        $scope.create = function() {
            var options = {};
            var position = 0;

            for (var i in $scope.fields) {
                if ($scope.fields[i].required && !$scope[i]) {
                    toastr.error($scope.fields[i].name + ' is required');
                    $scope.fields[i].error = true;
                    return true;
                } else if ($scope.fields[i].post) {
                    options[i] = $scope[i];
                }

                position++;

                if (position == Object.keys($scope.fields).length) {
                    createGroup(options);
                }
            }
        };

        function createGroup(options) {
            toast.show('Creating group...');
            $http.post('/api/management/groups', options)
                .success(function(data, status, headers, config) {
                    if (data.success) toast.success('Successfully created group');
                    else toast.error(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        }
    }
]);
