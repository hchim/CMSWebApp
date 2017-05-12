var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminUserSchema = new Schema({
    userName: { type: String, required: true},
    passwordHash: String,
    salt: String,
    createDate: {type: Date, default: Date.now },
    enabled: { type: Boolean, default: true },
    priviledges: []
});

module.exports = function (conn) {
    return conn.model('AdminUser', adminUserSchema);
}