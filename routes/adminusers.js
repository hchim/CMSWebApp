var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');
var bcrypt = require('bcrypt');
var uuid = require('uuid');

const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
    var AdminUser = mongooseHelper.getModel('AdminUser');
    AdminUser.find({})
        .limit(10)
        .sort({ createDate: -1 })
        .select({ userName: 1, createDate: 1 , enabled: 1})
        .exec(function (err, users) {
            res.render('admins/list', { users: users});
        });
});

router.get('/add', function (req, res, next) {
   res.render('admins/add', {
       layout: 'layouts/modal',
       title: "Add Admin User",
       formId: 'addAdminForm',
       formAction: '/admins'
   });
});

router.post('/', function(req, res, next) {
    var AdminUser = mongooseHelper.getModel('AdminUser');
    AdminUser.findOne({ 'userName': req.body.userName }, function (err, user) {
        if (err) {
            return res.json({
                result: false,
                message: err.message
            });
        }

        if (user != null) {
            return res.json({
                result: false,
                message: 'User name was already taken.',
            });
        } else {
            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(req.body.password, salt);

            var user = new AdminUser({
                "userName" : req.body.userName,
                "salt": salt,
                "passwordHash": hash
            });

            user.save(function (err, user) {
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
        }
    });
});

module.exports = router;
