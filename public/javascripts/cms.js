/**
 * Load url to the main area.
 * @param url
 */
function load(url) {
    $("#mainContent").load(url);
}

/**
 * Load form result to the main area.
 * @param formId
 */
function loadFormResult(formId) {
    var form = $('#' + formId);
    $.ajax({
        data: form.serialize(),
        type: form.attr('method'),
        url: form.attr('action'),
        success: function(response) {
            $('#mainContent').html(response);
        }
    });
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