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
    if (!validateForm(formId)) {
        return;
    }

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

function show(id) {
    $('#' + id).removeClass('hide').addClass('show');
}

function hide(id) {
    $('#' + id).addClass('hide').removeClass('show');
}

function validateForm(formid) {
    var form = document.getElementById(formid);
    for(var i = 0; i < form.elements.length; i++){
        if (!validateInput(form.elements[i])) {
            return false;
        }
    }

    return true;
}

function validateInput(element) {
    if(element.value === '' && element.hasAttribute('required')){
        showMessage('Warning', 'Please fill the required fields!', 'danger');
        return false;
    }
    //TODO add other validations here
    return true;
}


function showMessage(header, message, type) {
    if (header) {
        $("#alertHeader").html(header);
    }

    $("#alertMessage").html(message);
    if (type === 'warn') {
        $("#alertMessage").addClass('alert-warning');
    } else if (type === 'success') {
        $("#alertMessage").addClass('alert-success');
    } else if (type === 'info') {
        $("#alertMessage").addClass('alert-info');
    } else {
        $("#alertMessage").addClass('alert-danger');
    }

    $('#alertModal').modal("show");
}