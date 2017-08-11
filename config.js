var convict = require('convict');
var fs = require('fs');

// Load common configs of all the services
var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    server: {
        ip: {
            doc: "IP address to bind",
            format: 'ipaddress',
            default: '0.0.0.0',
            env: "IP"
        },
        port: {
            doc: "port to bind",
            format: 'port',
            default: 3015,
            env: "PORT"
        },
        session: {
            auth_token_expire: 30 * 24 * 60 * 60
        }
    },
    log: {
        dateformat: {
            doc: "date format",
            default: 'YYYY-MM-DD'
        },
        frequency: {
            doc: 'the log file rotate frequency',
            default: "daily"
        }
    },
    mongodb: {
        endpoint: "mongodb://localhost/",
        dbs: ['cmsdb', 'appinfodb', 'sleepdb', 'identitydb', 'metricdb']
    },
    cookie: {
        secret: 'f4add4cd-0178-4a90-9d2f-88d660585c2f',
        authCookieName: 'CMSWeb_Auth',
        userName: 'CMSWeb_UN'
    }
})

// Load environment dependent configuration
var config_path = './config/' + conf.get('env');
var files = fs.readdirSync(config_path);

files.forEach(function (file) {
    var path = config_path + "/" + file;
    conf.loadFile(path);
});

// Perform validation
conf.validate({allowed: 'strict'});

module.exports = conf;