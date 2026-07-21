$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const bookingsList = $('#bookings_list');
    const bookingModal = $('#booking_modal');

    loadPassengers();
    loadFlights();
    loadClasses();
    loadBookings();

    $('#btn_add_booking').on('click', function () {
        resetModal();
        bookingModal.modal('show');
    });

    $('#btn_save_booking').on('click', function () {
        saveBooking();
    });

    $('#btn_search_bookings').on('click', function () {
        loadBookings();
    });

    $('#filter_status').on('change', function () {
        loadBookings();
    });

    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    function loadPassengers() {
        $.ajax({
            url: 'controllers/passenger_ops.php?getpassengers=true',
            dataType: 'json',
            success: function (data) {
                let options = '<option value="">Select Passenger</option>';
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.passenger_id}">${item.first_name} ${item.last_name}</option>`;
                    });
                }
                $('#booking_passenger').html(options);
            },
            error: function () {
                showNotification(filterNotifications, 'danger', 'Error loading passengers');
            }
        });
    }

    function loadFlights() {
        $.ajax({
            url: 'controllers/flight_ops.php?getflights=true',
            dataType: 'json',
            success: function (data) {
                let options = '<option value="">Select Flight</option>';
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.flight_id}">${item.flight_number}</option>`;
                    });
                }
                $('#booking_flight').html(options);
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
                $('#booking_class').html(options);
            },
            error: function () {
                showNotification(filterNotifications, 'danger', 'Error loading classes');
            }
        });
    }

    function loadBookings() {
        const status = $('#filter_status').val();
        const searchText = $('#filter_booking_name').val();
        let url = 'controllers/booking_ops.php?getbookings=true';
        if (status) url += '&status=' + status;
        if (searchText) url += '&searchtext=' + searchText;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((booking, index) => {
                        const bookingDate = new Date(booking.booking_date).toLocaleDateString();
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${booking['passenger_name']}</td>
                                <td><span class="badge badge-primary">${booking['flight_number']}</span></td>
                                <td>${booking['flight_class_name']}</td>
                                <td>$${parseFloat(booking['total_price']).toFixed(2)}</td>
                                <td><span class="badge badge-${booking['status'] === 'confirmed' ? 'success' : booking['status'] === 'pending' ? 'warning' : 'danger'}">${booking['status']}</span></td>
                                <td>${bookingDate}</td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${booking['booking_id']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${booking['booking_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="8" class="text-center p-4 text-muted">No bookings found</td></tr>';
                }
                bookingsList.html(rows);

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure?')) {
                        $.post('controllers/booking_ops.php', { deletebooking: true, bookingid: id }, function (res) {
                            if (res.status === 'success') {
                                loadBookings();
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
                showNotification(filterNotifications, 'danger', 'Error loading bookings: ' + errorMsg.substring(0, 100));
                bookingsList.html('<tr><td colspan="8" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveBooking() {
        const id = $('#booking_id').val();
        const passengerId = $('#booking_passenger').val();
        const flightId = $('#booking_flight').val();
        const classId = $('#booking_class').val();
        const price = $('#booking_price').val();
        const status = $('#booking_status').val();

        if (!passengerId || !flightId || !classId || !price) {
            showNotification(modalNotifications, 'danger', 'Please fill all required fields');
            return;
        }

        const payload = {
            bookingid: id,
            passengerid: passengerId,
            flightid: flightId,
            flightclassid: classId,
            bookingdate: new Date().toISOString(),
            totalprice: price,
            status: status
        };

        if (id == 0) {
            payload.savebooking = true;
        } else {
            payload.updatebooking = true;
        }

        $.post('controllers/booking_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Booking saved successfully');
                loadBookings();
                setTimeout(() => bookingModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#booking_id').val('0');
        $('#booking_passenger').val('');
        $('#booking_flight').val('');
        $('#booking_class').val('');
        $('#booking_price').val('');
        $('#booking_status').val('pending');
        $('#modal_title').text('New Booking');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
