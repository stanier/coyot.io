<<<<<<< HEAD
function createSocket(host, port, callback) {
    callback(io('http://' + host + ':' + port));
=======
<<<<<<< HEAD
function createSocket(host, port, callback) {
    callback(io('http://' + host + ':' + port));
=======
var socket;

function createSocket(host, port, callback) {
    socket = io('http://' + host + ':' + port);

    callback();
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
}
