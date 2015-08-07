app.factory('ServerFactory', [
    '$http',
    '$q',
    '$stateParams',
    function($http, $q, $routeParams) {
        function serverInfo() {
            var deferred = $q.defer();

            $http.get('/api/server/' + $routeParams.hostname + '/')
                .success(function(data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    deferred.reject(data);
                })
            ;

            return deferred.promise;
        }
        function serverStats() {
            var deferred = $q.defer();

            $http.get('/api/server/' + $routeParams.hostname + '/')
                .success(function(data, status, headers, config) {
                    $http.get('//' + data.host + ':' + data.port + '/api/system/stats?type=all')
                        .success(function(data, status, headers, config) {
                            deferred.resolve(data);
                        })
                        .error(function(data, status, headers, config) {
                            deferred.reject(data);
                        })
                    ;
                })
                .error(function(data, status, headers, config) {
                    deferred.reject(data);
                })
            ;

            return deferred.promise;
        }

        return {
            getInfo: function(callback) {
                serverInfo().then(callback);
            },
            getStats: function(callback) {
                serverStats().then(callback);
            }
        };
    }
]);
