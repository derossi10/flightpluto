$(document).ready(function () {
    // Enforce Security
    enforceSecurity('PLANE');

    // Selectors
    const filterAirline = $('#filter_airline');
    const modalAirline = $('#plane_airline');
    const planesList = $('#planes_list');
    const planeModal = $('#plane_modal');
    const modalNotifications = $('#modal_notifications');
    const filterNotifications = $('#filter_notifications');

    // Initial Load
    loadAirlines(filterAirline, 'All Airlines');
    loadAirlines(modalAirline, 'Select Airline');
    loadPlanes();

    // Event Listeners
    $('#btn_add_plane').on('click', function () {
        resetModal();
        planeModal.modal('show');
    });

    $('#btn_save_plane').on('click', function () {
        savePlane();
    });

    $('#filter_airline, #filter_plane_model').on('input change', function() {
        loadPlanes();
    });

    // Functions
    function loadAirlines(target, firstOption) {
        $.getJSON('controllers/airline_ops.php?getairlines=true', function (data) {
            let options = `<option value="">-- ${firstOption} --</option>`;
            data.forEach(item => {
                options += `<option value="${item.airline_id}">${item.airline_name}</option>`;
            });
            target.html(options);
        });
    }

    function loadPlanes() {
        const airlineId = filterAirline.val();
        const modelName = $('#filter_plane_model').val().toLowerCase();

        $.getJSON('controllers/plane_ops.php?getplanes=true', function (data) {
            let filteredData = data;
            
            if (airlineId) filteredData = filteredData.filter(p => p.airline_id == airlineId);
            if (modelName) filteredData = filteredData.filter(p => p.plane_model.toLowerCase().includes(modelName));

            let rows = '';
            filteredData.forEach((plane, index) => {
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td class="font-weight-bold">${plane.plane_model}</td>
                        <td>${plane.airline_name}</td>
                        <td><span class="badge badge-info px-3 py-2 rounded-pill">${plane.plane_capacity} Seats</span></td>
                        <td class="text-right">
                            <button class="btn btn-primary btn-sm btn-edit" 
                                data-id="${plane.plane_id}" 
                                data-model="${plane.plane_model}" 
                                data-capacity="${plane.plane_capacity}" 
                                data-airline="${plane.airline_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm btn-delete" data-id="${plane.plane_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            planesList.html(rows || '<tr><td colspan="5" class="text-center p-4 text-muted">No aircraft found in fleet</td></tr>');

            // Bind Actions
            $('.btn-edit').on('click', function () {
                const btn = $(this);
                $('#plane_id').val(btn.data('id'));
                $('#plane_model').val(btn.data('model'));
                $('#plane_capacity').val(btn.data('capacity'));
                modalAirline.val(btn.data('airline'));
                $('#modal_title').text('Edit Aircraft Details');
                planeModal.modal('show');
            });

            $('.btn-delete').on('click', function () {
                const id = $(this).data('id');
                if (confirm('Are you sure you want to decommission this aircraft?')) {
                    $.post('controllers/plane_ops.php', { deleteplane: true, planeid: id }, function (res) {
                        if (res.status === 'success') {
                            loadPlanes();
                            showNotification(filterNotifications, 'success', res.message);
                        }
                    }, 'json');
                }
            });
        });
    }

    function savePlane() {
        const id = $('#plane_id').val();
        const payload = {
            planeid: id,
            airlineid: modalAirline.val(),
            planemodel: $('#plane_model').val(),
            capacity: $('#plane_capacity').val()
        };

        if (!payload.airlineid || !payload.planemodel || !payload.capacity) {
            showNotification(modalNotifications, 'danger', 'Please complete all aircraft details');
            return;
        }

        if (id == 0) payload.saveplane = true;
        else payload.updateplane = true;

        $.post('controllers/plane_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Aircraft registered successfully');
                loadPlanes();
                setTimeout(() => planeModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json');
    }

    function resetModal() {
        $('#plane_id').val('0');
        $('#plane_model').val('');
        $('#plane_capacity').val('');
        modalAirline.val('');
        $('#modal_title').text('Register New Aircraft');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
