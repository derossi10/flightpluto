$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const seatsList = $('#seats_list');
    const seatModal = $('#seat_modal');

    loadFlights();
    loadClasses();
    loadSeats();

    $('#btn_add_seat').on('click', function () {
        resetModal();
        seatModal.modal('show');
    });

    $('#btn_save_seat').on('click', function () {
        saveSeat();
    });

    $('#filter_flight, #filter_status').on('change', function () {
        loadSeats();
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
                $('#seat_flight').html(options);
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
                let options = '<option value="">Select Class</option>';
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.flight_class_id}">${item.flight_class_name}</option>`;
                    });
                }
                $('#seat_class').html(options);
            },
            error: function () {
                showNotification(filterNotifications, 'danger', 'Error loading classes');
            }
        });
    }

    function loadSeats() {
        const flightId = $('#filter_flight').val();
        const status = $('#filter_status').val();
        let url = 'controllers/seat_ops.php?getseats=true';
        if (flightId) url += '&flightid=' + flightId;
        if (status) url += '&status=' + status;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((seat, index) => {
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td><span class="badge badge-primary">${seat['flight_number']}</span></td>
                                <td>${seat['flight_class_name']}</td>
                                <td><strong>${seat['seat_number']}</strong></td>
                                <td><span class="badge badge-${seat['availability_status'] === 'available' ? 'success' : 'danger'}">${seat['availability_status']}</span></td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${seat['seat_id']}" data-flight="${seat['flight_id']}" data-class="${seat['flight_class_id']}" data-seatnum="${seat['seat_number']}" data-status="${seat['availability_status']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${seat['seat_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="6" class="text-center p-4 text-muted">No seats found</td></tr>';
                }
                seatsList.html(rows);

                $('.btn-edit').on('click', function () {
                    const btn = $(this);
                    $('#seat_id').val(btn.data('id'));
                    $('#seat_flight').val(btn.data('flight'));
                    $('#seat_class').val(btn.data('class'));
                    $('#seat_number').val(btn.data('seatnum'));
                    $('#seat_status').val(btn.data('status'));
                    $('#modal_title').text('Edit Seat');
                    seatModal.modal('show');
                });

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure?')) {
                        $.post('controllers/seat_ops.php', { deleteseat: true, seatid: id }, function (res) {
                            if (res.status === 'success') {
                                loadSeats();
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
                showNotification(filterNotifications, 'danger', 'Error loading seats: ' + errorMsg.substring(0, 100));
                seatsList.html('<tr><td colspan="6" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveSeat() {
        const id = $('#seat_id').val();
        const flightId = $('#seat_flight').val();
        const classId = $('#seat_class').val();
        const seatNum = $('#seat_number').val();
        const status = $('#seat_status').val();

        if (!flightId || !classId || !seatNum) {
            showNotification(modalNotifications, 'danger', 'Please fill all required fields');
            return;
        }

        const payload = {
            seatid: id,
            flightid: flightId,
            flightclassid: classId,
            seatnumber: seatNum,
            availabilitystatus: status
        };

        if (id == 0) {
            payload.saveseat = true;
        } else {
            payload.updateseat = true;
        }

        $.post('controllers/seat_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Seat saved successfully');
                loadSeats();
                setTimeout(() => seatModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#seat_id').val('0');
        $('#seat_flight').val('');
        $('#seat_class').val('');
        $('#seat_number').val('');
        $('#seat_status').val('available');
        $('#modal_title').text('Add Seat');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
