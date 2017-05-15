/**
 * Render json string as formated
 * e.g.
 * <pre>{{data | renderJson}}</pre>
 * @param jsonObj
 */
function renderJson(jsonObj) {
    return JSON.stringify(jsonObj, null, 2);
}

module.exports = {
    registerHelpers: function(hbs) {
        hbs.registerHelper('renderJson', renderJson)
    }
}