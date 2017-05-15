var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');

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
    Metric.find()
        .distinct('tag', function(error, metrics) {
        if (error) {
            console.log(error)
            return next(error);
        }
        res.render('metrics/list', { metrics: metrics});
    });
});

router.post('/q', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    Metric.find({
        tag: new RegExp(req.body.tag, 'ig')
    }).distinct('tag', function(error, metrics) {
        if (error) return next(error);
        res.render('metrics/list', { metrics: metrics});
    });
});

// List the records of the specified tag
router.get('/:tag', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    var page = 0;
    if (req.query.page) {
        page = req.query.page;
    }

    Metric.find({tag: req.params.tag})
        .limit(10)
        .skip(10 * page)
        .sort({createTime: -1})
        .exec(function(error, metrics) {
        if (error) {
            console.log(error)
            return next(error);
        }
        res.render('metrics/metric_list', { tag: req.params.tag, metrics: metrics});
    });
});

module.exports = router;
