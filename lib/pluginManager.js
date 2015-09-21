var pluginModel = require('./dbschema/plugin');

function installPlugin(options, callback) {
    if (!!options.repo)   installFromRepo(options.repo, callback);
    //if (!!options.handle) installByHandle(options.handle, callback);
    if (!!options.path)   installFromFilesystem(options.path, callback);
}

function installFromRepo(url, callback) {
    // TODO:  Code plugin installation from repo
    callback();
}

function installByHandle(handle, callback) {
    // TODO:  Code installation by handle, done with npm
    callback();
}

function installFromFilesystem(path, callback) {
    // TODO:  Code installation from filesystem, accepting path to file
    callback();
}

module.exports.install = installPlugin;
