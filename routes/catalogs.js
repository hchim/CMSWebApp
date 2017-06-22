var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');

router.get('/add', function (req, res, next) {
    res.render('products/addCatlog', {
        layout: 'layouts/modal',
        title: "Add Catalog",
        formId: 'addCatForm',
        formAction: '/catalogs'
    });
});

router.post('/', function (req, res, next) {
    var Catalog = mongooseHelper.getModel('Catalog');
    var cat = new Catalog({
        "catName" : req.body.catName,
        "displayName": req.body.displayName
    });

    cat.save(function (err) {
        if (err) {
            console.log(err)
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