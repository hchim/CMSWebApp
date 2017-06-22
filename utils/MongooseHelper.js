var mongoose = require('mongoose');
var conf = require('../config');
mongoose.Promise = require('bluebird');

var endpoint = conf.get('mongodb.endpoint')
var connections = {}
var models = {}

var options = {
    server:{
        auto_reconnect:true,
        socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
    },
    replset: {
        socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 }
    }
};

var CMS_DB = 'cmsdb';
var APPINFO_DB = 'appinfodb';
var SLEEP_DB = 'sleepdb';
var IDENTITY_DB = 'identitydb';
var METRIC_DB = 'metricdb';
var GOODYBAG_DB = 'goodybagdb';

module.exports = {
    init: function () {
        mongoose.connect(endpoint + CMS_DB, options, function (error) {
            if(error) {
                console.error(error);
                return;
            }
            console.info("Connected to mongodb: " + CMS_DB);
            if (conf.get('env') === 'development') {
                mongoose.set('debug', true);
            }

            var conn = connections[CMS_DB] = mongoose.connection;
            models['AdminUser'] = require('../models/AdminUser')(conn);

            conn = connections[APPINFO_DB] = mongoose.connection.useDb(APPINFO_DB);
            models['Suggestion'] = require('appinfoservicemodels').Suggestion(conn);
            models['AppConfig'] = require('appinfoservicemodels').AppConfig(conn);
            models['AppInfo'] = require('appinfoservicemodels').AppInfo(conn);

            conn = connections[SLEEP_DB] = mongoose.connection.useDb(SLEEP_DB);
            models['BabyInfo'] = require('sleepservicemodels').BabyInfo(conn);
            models['SleepRecord'] = require('sleepservicemodels').SleepRecord(conn);
            models['TrainingPlan'] = require('sleepservicemodels').TrainingPlan(conn);
            models['TrainingRecord'] = require('sleepservicemodels').TrainingRecord(conn);

            conn = connections[IDENTITY_DB] = mongoose.connection.useDb(IDENTITY_DB);
            models['User'] = require('identityservicemodels').User(conn);

            conn = connections[METRIC_DB] = mongoose.connection.useDb(METRIC_DB);
            models['Metric'] = require('metricservicemodels').Metric(conn);
            models['Monitor'] = require('metricservicemodels').Monitor(conn);
            models['Task'] = require('metricservicemodels').Task(conn);

            conn = connections[GOODYBAG_DB] = mongoose.connection.useDb(GOODYBAG_DB);
            models['Product'] = require('goodybagmodels').Product(conn);
            models['Catalog'] = require('goodybagmodels').Catalog(conn);
        });
    },
    getCMSConn : function() { return connections[CMS_DB] },
    getAppInfoConn : function() { return connections[APPINFO_DB] },
    getSleepConn: function() { return connections[SLEEP_DB] },
    getIdentityConn : function() { return connections[IDENTITY_DB] },
    getMetricConn : function() { return connections[METRIC_DB] },
    getGoodyBagConn: function () {
        return connections[GOODYBAG_DB];
    },
    getModel: function (modelName) {return models[modelName]}
}
