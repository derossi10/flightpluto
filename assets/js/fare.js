$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const faresList = $('#fares_list');
    const fareModal = $('#fare_modal');

    loadFlights();
    loadClasses();
    loadFares();

    $('#btn_add_fare').on('click', function () {
        resetModal();
        fareModal.modal('show');
    });

    $('#btn_save_fare').on('click', function () {
        saveFare();
    });

    $('#filter_flight, #filter_class').on('change', function () {
        loadFares();
    });

    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    function loadFlights() {
        $.ajax({
            url: 'controllers/flight_ops.php?getflights=true',
            dataType: 'json',
            success: function (data) {
                let options = '<option value="">All Flights</option>';
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.flight_id}">${item.flight_number}</option>`;
                    });
                }
                $('#filter_flight').html(options);
                $('#fare_flight').html(options);
            },
            error: function () {
                showNotification(filterNotifications, 'danger', 'Error loading flights');
            }
        });
    }

    function loadClasses() {
        $.ajax({
            url: 'controllers/flight_class_ops.php?getflightclasses=true',
            dataType: 'json',
            success: function (data) {
                let options = '<option value="">All Classes</option>';
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.flight_class_id}">${item.flight_class_name}</option>`;
                    });
                }
                $('#filter_class').html(options);
                $('#fare_class').html(options);
            },
            error: function () {
                showNotification(filterNotifications, 'danger', 'Error loading classes');
            }
        });
    }

    function loadFares() {
        const flightId = $('#filter_flight').val();
        const classId = $('#filter_class').val();
        let url = 'controllers/fare_ops.php?getfares=true';
        if (flightId) url += '&flightid=' + flightId;
        if (classId) url += '&flightclassid=' + classId;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((fare, index) => {
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td><span class="badge badge-primary">${fare['flight_number']}</span></td>
                                <td>${fare['flight_class_name']}</td>
                                <td>$${parseFloat(fare['unit_price']).toFixed(2)}</td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${fare['fare_id']}" data-flight="${fare['flight_id']}" data-class="${fare['flight_class_id']}" data-price="${fare['unit_price']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${fare['fare_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="5" class="text-center p-4 text-muted">No fares found</td></tr>';
                }
                faresList.html(rows);

                $('.btn-edit').on('click', function () {
                    const btn = $(this);
                    $('#fare_id').val(btn.data('id'));
                    $('#fare_flight').val(btn.data('flight'));
                    $('#fare_class').val(btn.data('class'));
                    $('#fare_price').val(btn.data('price'));
                    $('#modal_title').text('Edit Fare');
                    fareModal.modal('show');
                });

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure?')) {
                        $.post('controllers/fare_ops.php', { deletefare: true, fareid: id }, function (res) {
                            if (res.status === 'success') {
                                loadFares();
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
                showNotification(filterNotifications, 'danger', 'Error loading fares: ' + errorMsg.substring(0, 100));
                faresList.html('<tr><td colspan="5" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveFare() {
        const id = $('#fare_id').val();
        const flightId = $('#fare_flight').val();
        const classId = $('#fare_class').val();
        const price = $('#fare_price').val();

        if (!flightId || !classId || !price) {
            showNotification(modalNotifications, 'danger', 'Please fill all required fields');
            return;
        }

        const payload = {
            fareid: id,
            flightid: flightId,
            flightclassid: classId,
            unitprice: price
        };

        if (id == 0) {
            payload.savefare = true;
        } else {
            payload.updatefare = true;
        }

        $.post('controllers/fare_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Fare saved successfully');
                loadFares();
                setTimeout(() => fareModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#fare_id').val('0');
        $('#fare_flight').val('');
        $('#fare_class').val('');
        $('#fare_price').val('');
        $('#modal_title').text('Add Fare');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
