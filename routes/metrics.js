var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');

router.get('/', function(req, res, next) {
    var Metric = mongooseHelper.getModel('Metric');
    //TODO pagination
    Metric.find().distinct('tag', function(error, metrics) {
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

module.exports = router;
