var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');
var moment = require('moment');
var mapFuns = require('metricservicemodels').Map;
var reduceFuns = require('metricservicemodels').Reduce;

router.get('/:id/raw', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    Metric.findOne({_id: req.params.id}, function (err, metric) {
        if (err) return next(err);
        res.render('metrics/raw', {
            layout: 'layouts/modal',
            title: "Raw Metric",
            metric: metric
        });
    });
});

router.get('/', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    Metric.distinctMetrics({}, function(error, metrics) {
        if (error) {
            console.log(error)
            return next(error);
        }
        res.render('metrics/list', { metrics: metrics});
    });
});

router.post('/q', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    Metric.distinctMetrics({
        tag: new RegExp(req.body.tag, 'ig')
    }, function(error, metrics) {
        if (error) return next(error);
        res.render('metrics/list', { metrics: metrics});
    });
});

// List the records of the specified tag
router.get('/:tag', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    Metric.searchMetrics({tag: req.params.tag}, function(error, metrics) {
        if (error) {
            return next(error);
        }
        res.render('metrics/metric_list', { tag: req.params.tag, metrics: metrics, stats: []});
    }, req.query.page, 10);
});

router.post('/:tag/q', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    var query = {tag: req.params.tag};
    if (req.body.appVersion) {
        query['appVersion'] = req.body.appVersion;
    }
    if (req.body.hostname) {
        query['hostname'] = req.body.hostname;
    }
    if (req.body.deviceModel) {
        query['device.model'] = new RegExp(req.body.deviceModel, 'ig');
    }
    if (req.body.osType) {
        query['os.type'] = new RegExp(req.body.osType, 'ig');
    }

    if (req.body.time) {
        var dateTime = new moment(req.body.utcTime);
        var date = dateTime.toDate();
        var hour = req.body.hour;
        if (req.body.rangeType == 'B') {
            var start = dateTime.add(-hour, 'h').toDate();
            query['createTime'] = {
                $gte: start, $lte: date
            };
        } else {
            var end = dateTime.add(hour, 'h').toDate();
            query['createTime'] = {
                $gte: date, $lte: end
            }
        }
    }

    Metric.searchMetrics(query, function(error, metrics) {
            if (error) {
                return next(error);
            }
            if (!req.query.page) {
                Metric.mapReduceQuery(
                    query,
                    function (error, results) {
                        if (error) {
                            return next(error);
                        }
                        res.render('metrics/metric_list', {
                            tag: req.params.tag,
                            body: req.body,
                            metrics: metrics,
                            stats: results
                        });
                    },
                    mapFuns.metric5MMap,
                    metrics[0].type == 'time' ? reduceFuns.timeMetricReduce : reduceFuns.countMetricReduce
                );
            } else {
                res.render('metrics/metric_list', {
                    tag: req.params.tag,
                    body: req.body,
                    metrics: metrics,
                    stats: []
                });
            }
        }, req.query.page, 10);
});

module.exports = router;
