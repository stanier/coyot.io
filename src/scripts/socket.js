<<<<<<< HEAD
function createSocket(host, port, callback) {
    callback(io('http://' + host + ':' + port));
=======
var socket;

function createSocket(host, port, callback) {
    socket = io('http://' + host + ':' + port);

    callback();
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
}
