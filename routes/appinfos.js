var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');

router.get('/', function (req, res, next) {
    var AppInfo = mongooseHelper.getModel('AppInfo');
    AppInfo.find({})
        .sort({ createDate: -1 })
        .exec(function (err, apps) {
            res.render('apps/list', { apps: apps});
        });
})

router.get('/add', function (req, res, next) {
    res.render('apps/add', {
        layout: 'layouts/modal',
        title: "Add Application",
        formId: 'addAppForm',
        formAction: '/apps'
    });
});

router.post('/', function(req, res, next) {
    var AppInfo = mongooseHelper.getModel('AppInfo');
    var appInfo = new AppInfo({
        "appName" : req.body.appName,
        "platform": req.body.platform,
        "packageName": req.body.packageName,
        "description": req.body.description
    });

    appInfo.save(function (err, appInfo) {
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

router.get('/:id/generate', function (req, res, next) {
    var AppInfo = mongooseHelper.getModel('AppInfo');

    AppInfo.findOne({ '_id': req.params.id }, function (err, app) {
        if (err) {
            return res.json({
                result: false,
                message: err.message
            });
        }

        if (app == null) {
            return res.json({
                result: false,
                message: 'App does not exist..',
            });
        } else {
            res.render('apps/generate_apikey', {
                layout: 'layouts/modal',
                title: "Generate API Key",
                formId: 'generateAPIKeyForm',
                app: app,
                formAction: '/' + req.params.id + '/generate'
            });
        }
    });
});

router.post('/:id/generate', function(req, res, next) {
    var AppInfo = mongooseHelper.getModel('AppInfo');

    AppInfo.findOne({ '_id': req.params.id }, function (err, app) {
        if (err) {
            return res.json({
                result: false,
                message: err.message
            });
        }

        if (app == null) {
            return res.json({
                result: false,
                message: 'App does not exist..',
            });
        } else {
            if (!app.apiKeys) {
                app.apiKeys = []
            }
            app.apiKeys.push({
                sha256Sig: req.body.sha256Sig,
                apiKey: generateAPIKey(app.packageName, req.body.sha256Sig)
            })

            app.save(function (err) {
                if (err) {
                    return res.json({
                        result: false,
                        message: 'Failed to save API key.'
                    })
                }

                res.json({
                    result: true,
                    message: 'Successfully generate APIKey'
                })
            })
        }
    });
});

module.exports = router;
