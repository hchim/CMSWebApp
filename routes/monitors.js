var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');
var moment = require('moment');
var mapFuns = require('metricservicemodels').Map;
var reduceFuns = require('metricservicemodels').Reduce;

router.get('/', function(req, res, next) {
    var Monitor = mongooseHelper.getModel('Monitor');
    Monitor.searchMonitors({},
        function (err, monitors) {
            res.render('monitors/list', { monitors: monitors});
        },
        req.query.page,
        10
    );
});

var bestTimeUnit = function (fromTime, toTime) {
    var span = toTime.getTime() - fromTime.getTime();
    var aDay = 24 * 60 * 60 * 1000;
    if (span <= (2 * aDay)) { // <= 2 days
        return 'hour';
    } else if (span <= (2 * 7 * aDay)) { // <= 2 weeks
        return 'day'
    } else if (span <= (2 * 30 * 7 * aDay)) { // <= 2 months
        return 'week'
    } else {
        return 'month'
    }
};

var loadMonitorResult = function(req, res, next) {
    var Monitor = mongooseHelper.getModel('Monitor');
    var Metric = mongooseHelper.getModel('Metric');
    Monitor.findOne({_id: req.params.id},
        function (err, monitor) {
            if (err) {
                return next(err);
            }
            if (!monitor) {
                err = {message: 'Monitor not found!'}
                return next(err);
            }

            var query = {tag: monitor.tag};
            if (monitor.appName) {
                query['appName'] = monitor.appName;
            }
            if (monitor.appVersion) {
                query['appVersion'] = monitor.appVersion;
            }
            if (monitor.hostname) {
                query['hostname'] = monitor.hostname;
            }
            if (monitor.osName) {
                query['os.name'] = new RegExp(monitor.osName, 'ig');
            }
            var toTime = new Date();
            if (req.body.toUTCTime) {
                toTime = new moment(req.body.toUTCTime).toDate();
            }
            var fromTime = new Date(toTime.getTime() - 24 * 60 * 60 * 1000); //default search 1 day
            if (req.body.fromUTCTime) {
                fromTime = new moment(req.body.fromUTCTime).toDate();
            }
            query['createTime'] = {
                $gte: fromTime, $lte: toTime
            }

            Metric.mapReduceQuery(
                query,
                function (error, results) {
                    if (error) {
                        return next(error);
                    }

                    res.render('monitors/monitor', {
                        monitor: monitor,
                        body: req.body,
                        stats: results,
                        unit: bestTimeUnit(fromTime, toTime)
                    });
                },
                mapFuns.metric5MMap,
                monitor.type == 'time' ? reduceFuns.timeMetricReduce : reduceFuns.countMetricReduce
            );

        }
    );
};

router.get('/:id/detail', loadMonitorResult);
router.post('/:id/detail', loadMonitorResult);

router.post('/q', function(req, res, next) {
    var Monitor = mongooseHelper.getModel('Monitor');
    var query = {};
    if(req.body.name) {
        query['name'] = new RegExp(req.body.name, 'ig')
    }
    if(req.body.tag) {
        query['tag'] = new RegExp(req.body.tag, 'ig')
    }

    Monitor.searchMonitors(query,
        function (err, monitors) {
            res.render('monitors/list', { monitors: monitors});
        },
        req.query.page,
        10
    );
});

router.get('/add', function (req, res, next) {
   res.render('monitors/add', {
       layout: 'layouts/modal',
       title: "Add Monitor",
       formId: 'addMonitorForm',
       formAction: '/monitors'
   });
});

router.post('/', function(req, res, next) {
    var Monitor = mongooseHelper.getModel('Monitor');
    var monitor = new Monitor({
        name: req.body.name,
        statInterval: req.body.statInterval,
        aboveOrBelow: req.body.aboveOrBelow,
        threshold: req.body.threshold,
        lastForTime: req.body.lastForTime,
        tag: req.body.tag,
        type: req.body.type,
        appName: req.body.appName,
        appVersion: req.body.appVersion,
        osName: req.body.osName
    });
    monitor.save(function (err, monitor) {
        if (err) {
            return res.json({
                result: false,
                message: err.message
            });
        }

        return res.json({
            result: true,
            message: 'Successfully created!'
        })
    });
});

module.exports = router;
