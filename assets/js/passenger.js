$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const passengersList = $('#passengers_list');
    const passengerModal = $('#passenger_modal');

    loadPassengers();

    $('#btn_add_passenger').on('click', function () {
        resetModal();
        passengerModal.modal('show');
    });

    $('#btn_save_passenger').on('click', function () {
        savePassenger();
    });

    $('#btn_search_passengers').on('click', function () {
        loadPassengers();
    });

    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    function loadPassengers() {
        const searchText = $('#filter_passenger_name').val();
        let url = 'controllers/passenger_ops.php?getpassengers=true';
        if (searchText) url += '&searchtext=' + searchText;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((passenger, index) => {
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${passenger['first_name']}</td>
                                <td>${passenger['last_name']}</td>
                                <td><span class="badge badge-info">${passenger['passport_number']}</span></td>
                                <td>${passenger['email']}</td>
                                <td>${passenger['phone']}</td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${passenger['passenger_id']}" data-fname="${passenger['first_name']}" data-lname="${passenger['last_name']}" data-dob="${passenger['date_of_birth']}" data-passport="${passenger['passport_number']}" data-email="${passenger['email']}" data-phone="${passenger['phone']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${passenger['passenger_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="7" class="text-center p-4 text-muted">No passengers found</td></tr>';
                }
                passengersList.html(rows);

                $('.btn-edit').on('click', function () {
                    const btn = $(this);
                    $('#passenger_id').val(btn.data('id'));
                    $('#passenger_first_name').val(btn.data('fname'));
                    $('#passenger_last_name').val(btn.data('lname'));
                    $('#passenger_dob').val(btn.data('dob'));
                    $('#passenger_passport').val(btn.data('passport'));
                    $('#passenger_email').val(btn.data('email'));
                    $('#passenger_phone').val(btn.data('phone'));
                    $('#modal_title').text('Edit Passenger');
                    passengerModal.modal('show');
                });

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure you want to delete this passenger?')) {
                        $.post('controllers/passenger_ops.php', { deletepassenger: true, passengerid: id }, function (res) {
                            if (res.status === 'success') {
                                loadPassengers();
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
                showNotification(filterNotifications, 'danger', 'Error loading passengers: ' + errorMsg.substring(0, 100));
                passengersList.html('<tr><td colspan="7" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function savePassenger() {
        const id = $('#passenger_id').val();
        const firstName = $('#passenger_first_name').val();
        const lastName = $('#passenger_last_name').val();
        const dob = $('#passenger_dob').val();
        const passport = $('#passenger_passport').val();
        const email = $('#passenger_email').val();
        const phone = $('#passenger_phone').val();

        if (!firstName || !lastName || !dob || !passport || !email || !phone) {
            showNotification(modalNotifications, 'danger', 'Please fill all fields');
            return;
        }

        const payload = {
            passengerid: id,
            firstname: firstName,
            lastname: lastName,
            dob: dob,
            passport: passport,
            email: email,
            phone: phone
        };

        if (id == 0) {
            payload.savepassenger = true;
        } else {
            payload.updatepassenger = true;
        }

        $.post('controllers/passenger_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Passenger saved successfully');
                loadPassengers();
                setTimeout(() => passengerModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#passenger_id').val('0');
        $('#passenger_first_name').val('');
        $('#passenger_last_name').val('');
        $('#passenger_dob').val('');
        $('#passenger_passport').val('');
        $('#passenger_email').val('');
        $('#passenger_phone').val('');
        $('#modal_title').text('Add Passenger');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
