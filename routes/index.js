var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conf = require('../config');
var mongooseHelper = require('../utils/MongooseHelper');

var bcrypt = require('bcrypt');
var uuid = require('uuid');

var authCookieName = conf.get('cookie.authCookieName');
var userNameCookie = conf.get('cookie.userName');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.signedCookies[authCookieName]) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

router.get("/healthy", function(req, res, next) {
    if (mongoose.connection.readyState == 1) {
        res.json({"healthy": true});
    } else {
        res.json({"healthy": false});
    }
});

router.get('/login', function(req, res, next) {
    res.render('login', {layout: 'layouts/login'});
});

router.get('/logout', function(req, res, next) {
    res.clearCookie(authCookieName);
    res.clearCookie(userNameCookie);
    res.redirect('/login');
});

router.post('/login', function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;

    var AdminUser = mongooseHelper.getModel('AdminUser');
    AdminUser.findOne({ 'userName': userName , 'enabled': true}, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user == null) {
            res.render('login', {
                message: 'Login failed. User does not exist.',
                userName: userName,
                layout: 'layouts/login'
            });
        } else {
            if (bcrypt.compareSync(password, user.passwordHash)) {
                res.cookie(authCookieName, uuid.v4(), {signed: true});
                res.cookie(userNameCookie, userName, {signed: true});
                res.redirect('/home');
            } else {
                res.render('login', {
                    message: 'Login failed. Invalid username and password pairs.',
                    userName: userName,
                    layout: 'layouts/login'
                });
            }
        }
    });
});

module.exports = router;
