var conf = require('../config')
var authCookieName = conf.get('cookie.authCookieName');

//authenticate middleware
module.exports = function (req, res, next) {
    if (req.signedCookies[authCookieName]) {
        next();
    } else {
        res.redirect('/login');
    }
};