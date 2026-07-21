$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const classList = $('#classes_list');
    const classModal = $('#class_modal');

    loadClasses();

    $('#btn_add_class').on('click', function () {
        resetModal();
        classModal.modal('show');
    });

    $('#btn_save_class').on('click', function () {
        saveClass();
    });

    $('#btn_search_classes').on('click', function () {
        loadClasses();
    });

    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    function loadClasses() {
        const className = $('#filter_class_name').val();
        let url = 'controllers/flight_class_ops.php?getflightclasses=true';
        if (className) url += '&classname=' + className;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((flightClass, index) => {
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${flightClass['flight_class_name']}</td>
                                <td>${flightClass['description']}</td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${flightClass['flight_class_id']}" data-name="${flightClass['flight_class_name']}" data-desc="${flightClass['description']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${flightClass['flight_class_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="4" class="text-center p-4 text-muted">No flight classes found</td></tr>';
                }
                classList.html(rows);

                $('.btn-edit').on('click', function () {
                    const btn = $(this);
                    $('#class_id').val(btn.data('id'));
                    $('#class_name').val(btn.data('name'));
                    $('#class_description').val(btn.data('desc'));
                    $('#modal_title').text('Edit Flight Class');
                    classModal.modal('show');
                });

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure you want to delete this class?')) {
                        $.post('controllers/flight_class_ops.php', { deleteflightclass: true, flightclassid: id }, function (res) {
                            if (res.status === 'success') {
                                loadClasses();
                                showNotification(filterNotifications, 'success', res.message);
                            } else {
                                showNotification(filterNotifications, 'danger', res.message || 'Failed to delete');
                            }
                        }, 'json').fail(function (res) {
                            showNotification(filterNotifications, 'danger', 'Error: ' + (res.statusText || 'Unknown error'));
                        });
                    }
                });
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading classes: ' + errorMsg.substring(0, 100));
                classList.html('<tr><td colspan="4" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveClass() {
        const id = $('#class_id').val();
        const name = $('#class_name').val();
        const desc = $('#class_description').val();

        if (!name) {
            showNotification(modalNotifications, 'danger', 'Please fill all required fields');
            return;
        }

        const payload = {
            flightclassid: id,
            flightclassname: name,
            description: desc
        };

        if (id == 0) {
            payload.saveflightclass = true;
        } else {
            payload.updateflightclass = true;
        }

        $.post('controllers/flight_class_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Class saved successfully');
                loadClasses();
                setTimeout(() => classModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#class_id').val('0');
        $('#class_name').val('');
        $('#class_description').val('');
        $('#modal_title').text('Add Flight Class');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
