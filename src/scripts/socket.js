var socket;

function createSocket(host, port, callback) {
    socket = io('http://' + host + ':' + port);

    callback();
}
