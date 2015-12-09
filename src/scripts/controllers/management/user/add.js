app.controller('UserAddCtlr', [
    '$scope',
    '$http',
    'ToastFactory',
    function($scope, $http, toast) {
        $scope.fields = {
            username: {
                name: 'Username',
                post: true,
                required: true
            },
            email: {
                name: 'Email',
                post: true,
                required: true
            },
            password: {
                name: 'Password',
                post: true,
                required: true
            },
            confirmPassword: {
                name: 'Password Confirmation',
                post: false,
                required: true
            },
            groups: {
                name: 'Groups',
                post: true,
                required: false
            }
        };

        $http.get('/api/management/groups')
            .success(function(data, status, headers, config) {
                if (data.success) $scope.availableGroups = data.result;
                else toast.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toast.error(data);
            })
        ;

        $scope.create = function() {
            var options = {};
            var position = 0;

            for (var i in $scope.fields) {
                if ($scope.fields[i].required && !$scope[i]) {
                    toast.error($scope.fields[i].name + ' is required');
                    $scope.fields[i].error = true;
                    return true;
                } else if ($scope.fields[i].post) {
                    options[i] = $scope[i];
                }

                position++;

                if (position == Object.keys($scope.fields).length) {
                    if ($scope.password == $scope.confirmPassword) {
                        createUser(options);
                    } else {
                        toast.error('Passwords do not match');
                        return true;
                    }
                }
            }
        };

        function createUser(options) {
            toast.show('Creating user...');
            $http.post('/api/management/users', options)
                .success(function(data, status, headers, config) {
                    if (data.success) toast.success('Successfully created user');
                    else toast.show(data.error);
                })
                .error(function(data, status, headers, config) {
                    toast.error(data);
                })
            ;
        }
    }
]);
