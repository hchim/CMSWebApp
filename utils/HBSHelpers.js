/**
 * Render json string as formated
 * e.g.
 * <pre>{{data | renderJson}}</pre>
 * @param jsonObj
 */
function renderJson(jsonObj) {
    return JSON.stringify(jsonObj, null, 2);
}

/**
 * Format the stats result for drawing charts.
 * @param results
 * @returns {string}
 */
function formatMetricStatsResult(results) {
    var output = '[';
    results.forEach(function (item, index, array) {
        output += ('{ x: new Date(' + item._id * 300000 + '), y: ' + item.value + '},');
    });
    output += ']';
    return output;
}

module.exports = {
    registerHelpers: function(hbs) {
        hbs.registerHelper('renderJson', renderJson),
        hbs.registerHelper('formatMetricStatsResult', formatMetricStatsResult)
    }
}