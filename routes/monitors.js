var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');

/* GET users listing. */
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
