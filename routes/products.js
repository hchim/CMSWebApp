var express = require('express');
var router = express.Router();
var mongooseHelper = require('../utils/MongooseHelper');

const n_per_page = 10;

router.get('/deleted', function (req, res, next) {
    var Product = mongooseHelper.getModel('Product');
    var page = 0;
    if (req.query.page) {
        page = parseInt(req.query.page)
    }

    Product.find({status: 'Deleted'})
        .sort({ createDate: -1 })
        .skip(page * n_per_page)
        .limit(n_per_page)
        .populate('_catalog')
        .exec(function (err, products) {
            res.render('products/deleted_list', { products: products});
        });
})

router.get('/', function (req, res, next) {
    var Product = mongooseHelper.getModel('Product');
    var page = 0;
    if (req.query.page) {
        page = parseInt(req.query.page)
    }

    Product.find({status: {$ne : 'Deleted'}})
        .sort({ createDate: -1 })
        .skip(page * n_per_page)
        .limit(n_per_page)
        .populate('_catalog')
        .exec(function (err, products) {
            res.render('products/list', { products: products});
        });
})

router.get('/add', function (req, res, next) {
    var Catalog = mongooseHelper.getModel('Catalog');
    Catalog.find({}).exec(function (err, cats) {
        if (err) {
            return next(err);
        }
        res.render('products/add', {
            layout: 'layouts/modal',
            title: "Add Product",
            formId: 'addProductForm',
            formAction: '/products',
            catalogs: cats
        });
    });
});

router.post('/', function (req, res, next) {
    var Product = mongooseHelper.getModel('Product');
    var product = new Product({
        "productName" : req.body.productName,
        "displayName": req.body.displayName,
        "description": req.body.description,
        "_catalog": req.body.catalog,
        "listPrice": req.body.listPrice,
        "purchasePrice": req.body.purchasePrice,
        "quantity": req.body.quantity,
        "iconImage": req.body.iconImage,
        "images": req.body.images
    });

    product.save(function (err) {
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

