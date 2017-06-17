/**
 * Created by huiche on 6/17/17.
 */
var APIKEYGenerator = function (keyStoreFile, keyStorePassword, alias, keyPassword) {
    this.keyStoreFile = keyStoreFile;
    this.keyStorePassword = keyStorePassword;
    this.alias = alias;
    this.keyPassword = keyPassword;
}

APIKEYGenerator.prototype.generateAPIKey = function (packageName, sha256Sig) {
    var apiKeyObj = {
        version: 'V1',
        algorithm: 'SHA256withRSA',
        packageName: packageName,
        signature: sha256Sig
    }

    return null
};

module.exports = APIKEYGenerator;