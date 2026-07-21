$(document).ready(function () {
    // Selectors
    const filterAirline = $('#filter_airline');
    const filterOrigin = $('#filter_origin');
    const filterDestination = $('#filter_destination');
    
    const modalAirline = $('#flight_airline');
    const modalPlane = $('#flight_plane');
    const modalOrigin = $('#flight_origin');
    const modalDestination = $('#flight_destination');
    
    const flightsList = $('#flights_list');
    const flightModal = $('#flight_modal');
    const modalNotifications = $('#modal_notifications');
    const filterNotifications = $('#filter_notifications');

    let allPlanes = []; // Cache planes to filter by airline

    // Initial Load
    loadAirlines(filterAirline, 'All Airlines');
    loadAirlines(modalAirline, 'Select Airline');
    loadAirports(filterOrigin, 'Any Origin');
    loadAirports(filterDestination, 'Any Destination');
    loadAirports(modalOrigin, 'Select Origin');
    loadAirports(modalDestination, 'Select Destination');
    
    // Load planes cache
    $.ajax({
        url: 'controllers/plane_ops.php?getplanes=true',
        dataType: 'json',
        success: function(data) {
            allPlanes = Array.isArray(data) ? data : [];
        },
        error: function (xhr, status, error) {
            const errorMsg = xhr.responseText || error || 'Unknown error';
            showNotification(filterNotifications, 'danger', 'Error loading aircraft: ' + errorMsg.substring(0, 100));
        }
    });

    loadFlights();

    // Event Listeners
    $('#btn_add_flight').on('click', function () {
        resetModal();
        flightModal.modal('show');
    });

    $('#btn_save_flight').on('click', function () {
        saveFlight();
    });

    $('#filter_airline, #filter_origin, #filter_destination').on('change', function() {
        loadFlights();
    });

    // Filter planes when airline changes in modal
    modalAirline.on('change', function() {
        const airlineId = $(this).val();
        let options = '<option value="">Select Plane</option>';
        const filteredPlanes = allPlanes.filter(p => p.airline_id == airlineId);
        filteredPlanes.forEach(plane => {
            options += `<option value="${plane.plane_id}">${plane.plane_model} (${plane.plane_capacity} seats)</option>`;
        });
        modalPlane.html(options);
    });

    // Functions
    function loadAirlines(target, firstOption) {
        $.ajax({
            url: 'controllers/airline_ops.php?getairlines=true',
            dataType: 'json',
            success: function (data) {
                let options = `<option value="">-- ${firstOption} --</option>`;
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.airline_id}">${item.airline_name}</option>`;
                    });
                }
                target.html(options);
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading airlines: ' + errorMsg.substring(0, 100));
            }
        });
    }

    function loadAirports(target, firstOption) {
        $.ajax({
            url: 'controllers/airport_ops.php?getairports=true',
            dataType: 'json',
            success: function (data) {
                let options = `<option value="">-- ${firstOption} --</option>`;
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        options += `<option value="${item.airport_id}">${item.airport_name} (${item.iata_code})</option>`;
                    });
                }
                target.html(options);
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading airports: ' + errorMsg.substring(0, 100));
            }
        });
    }

    function loadFlights() {
        const airlineId = filterAirline.val();
        const originId = filterOrigin.val();
        const destId = filterDestination.val();

        $.ajax({
            url: 'controllers/flight_ops.php?getflights=true',
            dataType: 'json',
            success: function (data) {
                let filteredData = Array.isArray(data) ? data : [];
            
            if (airlineId) filteredData = filteredData.filter(f => f.airline_id == airlineId);
            if (originId) filteredData = filteredData.filter(f => f.origin_airport_id == originId);
            if (destId) filteredData = filteredData.filter(f => f.destination_airport_id == destId);

            let rows = '';
            filteredData.forEach((flight, index) => {
                const depDate = new Date(flight.departure_time).toLocaleString();
                const arrDate = new Date(flight.arrival_time).toLocaleString();
                
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><span class="flight-number">${flight.flight_number}</span></td>
                        <td>${flight.airline_name}</td>
                        <td>
                            <span class="airport-code">${flight.origin_iata}</span> 
                            <i class="fas fa-long-arrow-alt-right mx-2 text-muted"></i> 
                            <span class="airport-code">${flight.destination_iata}</span>
                        </td>
                        <td><span class="time-badge">${depDate}</span></td>
                        <td><span class="time-badge">${arrDate}</span></td>
                        <td><small>${flight.plane_model}</small></td>
                        <td class="text-right">
                            <button class="btn btn-primary btn-sm btn-edit" data-id="${flight.flight_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm btn-delete" data-id="${flight.flight_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            flightsList.html(rows || '<tr><td colspan="8" class="text-center p-4 text-muted">No flights found</td></tr>');

            // Action Bindings
            $('.btn-edit').on('click', function () {
                const id = $(this).data('id');
                editFlight(id);
            });

            $('.btn-delete').on('click', function () {
                const id = $(this).data('id');
                if (confirm('Are you sure you want to delete this flight?')) {
                    $.post('controllers/flight_ops.php', { deleteflight: true, flightid: id }, function (res) {
                        if (res.status === 'success') {
                            loadFlights();
                            showNotification(filterNotifications, 'success', res.message);
                        } else {
                            showNotification(filterNotifications, 'danger', res.message || 'Failed to delete flight');
                        }
                    }, 'json').fail(function (res) {
                        showNotification(filterNotifications, 'danger', 'Error deleting flight: ' + (res.statusText || 'Unknown error'));
                    });
                }
            });
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading flights: ' + errorMsg.substring(0, 100));
                flightsList.html('<tr><td colspan="8" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveFlight() {
        const id = $('#flight_id').val();
        const payload = {
            flightid: id,
            flightnumber: $('#flight_number').val(),
            airlineid: modalAirline.val(),
            planeid: modalPlane.val(),
            origin: modalOrigin.val(),
            destination: modalDestination.val(),
            departure: $('#flight_departure').val(),
            arrival: $('#flight_arrival').val(),
            duration: $('#flight_duration').val()
        };

        if (!payload.flightnumber || !payload.airlineid || !payload.origin || !payload.destination) {
            showNotification(modalNotifications, 'danger', 'Please fill all required fields');
            return;
        }

        if (id == 0) {
            payload.saveflight = true;
        } else {
            payload.updateflight = true;
        }

        $.post('controllers/flight_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Flight schedule saved successfully');
                loadFlights();
                setTimeout(() => flightModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving flight: ' + (res.statusText || 'Unknown error'));
        });
    }

    function editFlight(id) {
        $.ajax({
            url: `controllers/flight_ops.php?getflightdetails=true&flightid=${id}`,
            dataType: 'json',
            success: function(res) {
            const data = Array.isArray(res) ? res[0] : res;
            if (data) {
                $('#flight_id').val(data.flight_id);
                $('#flight_number').val(data.flight_number);
                modalAirline.val(data.airline_id).trigger('change'); // Trigger change to load planes
                
                // Wait for planes to load before setting plane ID
                setTimeout(() => {
                    modalPlane.val(data.plane_id);
                }, 100);

                modalOrigin.val(data.origin_airport_id);
                modalDestination.val(data.destination_airport_id);
                
                // Format date for datetime-local
                if (data.departure_time) $('#flight_departure').val(data.departure_time.replace(' ', 'T'));
                if (data.arrival_time) $('#flight_arrival').val(data.arrival_time.replace(' ', 'T'));
                
                $('#flight_duration').val(data.duration_minutes);
                $('#modal_title').text('Edit Flight Schedule');
                flightModal.modal('show');
                }
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading flight details: ' + errorMsg.substring(0, 100));
            }
        });
    }

    function resetModal() {
        $('#flight_id').val('0');
        $('#flight_number').val('');
        modalAirline.val('');
        modalPlane.html('<option value="">Select Airline First</option>');
        modalOrigin.val('');
        modalDestination.val('');
        $('#flight_departure').val('');
        $('#flight_arrival').val('');
        $('#flight_duration').val('');
        $('#modal_title').text('Schedule New Flight');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
