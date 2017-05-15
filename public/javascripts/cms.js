/**
 * Load url to the main area.
 * @param url
 */
function load(url) {
    $("#mainContent").load(url);
}

/**
 * Load and show the url in modal.
 * @param url
 */
function showModal(url) {
    $("#cmsModal").load(url, function () {
        $('#cmsModal').modal('show');
    });
}