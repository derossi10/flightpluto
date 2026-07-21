$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const paymentsList = $('#payments_list');
    const paymentModal = $('#payment_modal');

    loadBookings();
    loadPayments();

    $('#btn_add_payment').on('click', function () {
        resetModal();
        paymentModal.modal('show');
    });

    $('#btn_save_payment').on('click', function () {
        savePayment();
    });

    $('#filter_payment_status, #filter_payment_method').on('change', function () {
        loadPayments();
    });

    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    function loadBookings() {
        $.ajax({
            url: 'controllers/booking_ops.php?getbookings=true',
            dataType: 'json',
            success: function (data) {
                let options = '<option value="">Select Booking</option>';
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.booking_id}">${item.booking_id} - ${item.passenger_name}</option>`;
                    });
                }
                $('#payment_booking').html(options);
            },
            error: function () {
                showNotification(filterNotifications, 'danger', 'Error loading bookings');
            }
        });
    }

    function loadPayments() {
        const status = $('#filter_payment_status').val();
        const method = $('#filter_payment_method').val();
        let url = 'controllers/payment_ops.php?getpayments=true';
        if (status) url += '&status=' + status;
        if (method) url += '&method=' + method;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((payment, index) => {
                        const paymentDate = new Date(payment.payment_date).toLocaleDateString();
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td><span class="badge badge-info">Booking #${payment['booking_id']}</span></td>
                                <td>$${parseFloat(payment['amount_paid']).toFixed(2)}</td>
                                <td>${payment['payment_method'].replace('_', ' ')}</td>
                                <td><span class="badge badge-${payment['payment_status'] === 'completed' ? 'success' : payment['payment_status'] === 'pending' ? 'warning' : 'danger'}">${payment['payment_status']}</span></td>
                                <td>${paymentDate}</td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${payment['payment_id']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${payment['payment_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="7" class="text-center p-4 text-muted">No payments found</td></tr>';
                }
                paymentsList.html(rows);

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure?')) {
                        $.post('controllers/payment_ops.php', { deletepayment: true, paymentid: id }, function (res) {
                            if (res.status === 'success') {
                                loadPayments();
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
                showNotification(filterNotifications, 'danger', 'Error loading payments: ' + errorMsg.substring(0, 100));
                paymentsList.html('<tr><td colspan="7" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function savePayment() {
        const id = $('#payment_id').val();
        const bookingId = $('#payment_booking').val();
        const amount = $('#payment_amount').val();
        const method = $('#payment_method').val();
        const status = $('#payment_status').val();

        if (!bookingId || !amount || !method) {
            showNotification(modalNotifications, 'danger', 'Please fill all required fields');
            return;
        }

        const payload = {
            paymentid: id,
            bookingid: bookingId,
            amountpaid: amount,
            paymentdate: new Date().toISOString(),
            paymentmethod: method,
            paymentstatus: status
        };

        if (id == 0) {
            payload.savepayment = true;
        } else {
            payload.updatepayment = true;
        }

        $.post('controllers/payment_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Payment saved successfully');
                loadPayments();
                setTimeout(() => paymentModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#payment_id').val('0');
        $('#payment_booking').val('');
        $('#payment_amount').val('');
        $('#payment_method').val('credit_card');
        $('#payment_status').val('pending');
        $('#modal_title').text('New Payment');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
