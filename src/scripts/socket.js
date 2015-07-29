function createSocket(host, port, callback) {
    callback(io('http://' + host + ':' + port));
}
