app.controller('UserAddCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
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
            }
        };

        $scope.groups = function() {
            $http.get('/api/management/groups')
                .success(function(data, status, headers, config) {
                    return data;
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        }();

        console.log($scope.groups);

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
                    if ($scope.password == $scope.confirmPassword) {
                        createUser(options);
                    } else {
                        toastr.error('Passwords do not match');
                        return true;
                    }
                }
            }
        };

        function createUser(options) {
            toastr.info('Creating user...');
            $http.post('/api/management/users', options)
                .success(function(data, status, headers, config) {
                    toastr.success('Successfully created user');
                })
                .error(function(data, status, headers, config) {
                    toastr.error('An error has occurred');
                })
            ;
        }
    }
]);
