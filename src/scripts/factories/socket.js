app.factory('SocketFactory', ['$rootScope', function($rootScope) {
    var socket;

    return {
        init: function(host, port, callback) {
            socket = io.connect(host + ':' + port);

            callback();
        },
        on: function(eventName, callback) {
            function wrapper() {
                var args = arguments;

                callback.apply(socket, args);
            }
            socket.on(eventName, wrapper);

            return function() {
                socket.removeListener(eventName, wrapper);
            };
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;

                if (!!callback) callback.apply(socket, args);
            });
        },
        removeAllListeners: function() {
            if (!!socket) socket.removeAllListeners();
        }
    };
}]);
