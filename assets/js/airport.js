$(document).ready(function () {
    // Selectors
    const filterCity = $('#filter_city');
    const modalCity = $('#airport_city');
    const airportsList = $('#airports_list');
    const airportModal = $('#airport_modal');
    const modalNotifications = $('#modal_notifications');
    const filterNotifications = $('#filter_notifications');

    // Initial Load
    loadCities(filterCity, 'All Cities');
    loadCities(modalCity, 'Select City');
    loadAirports();

    // Event Listeners
    $('#btn_add_airport').on('click', function () {
        resetModal();
        airportModal.modal('show');
    });

    $('#btn_save_airport').on('click', function () {
        saveAirport();
    });

    $('#btn_search_airports').on('click', function () {
        loadAirports();
    });

    // Clear notifications on input
    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    // Load cities for dropdowns
    function loadCities(target, firstOption) {
        $.ajax({
            url: 'controllers/city_ops.php?getcities=true',
            dataType: 'json',
            success: function (data) {
                let options = `<option value="">-- ${firstOption} --</option>`;
                if (Array.isArray(data)) {
                    data.forEach(city => {
                        options += `<option value="${city['city_id']}">${city['city_name']}</option>`;
                    });
                }
                target.html(options);
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading cities: ' + errorMsg.substring(0, 100));
            }
        });
    }

    // Fetch and display airports
    function loadAirports() {
        const cityId = filterCity.val();
        const airportName = $('#filter_airport_name').val();

        let url = 'controllers/airport_ops.php?getairports=true';
        // Filtering will be handled client-side if API doesn't support params
        
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let filteredData = Array.isArray(data) ? data : [];
                
                if (cityId) {
                    filteredData = filteredData.filter(a => a.city_id == cityId);
                }
                if (airportName) {
                    const search = airportName.toLowerCase();
                    filteredData = filteredData.filter(a => 
                        a.airport_name.toLowerCase().includes(search) || 
                        a.iata_code.toLowerCase().includes(search)
                    );
                }

                let rows = '';
                filteredData.forEach((airport, index) => {
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${airport['airport_name']}</td>
                        <td><span class="badge badge-info badge-pill">${airport['iata_code']}</span></td>
                        <td>${airport['city_name'] || 'N/A'}</td>
                        <td>${airport['country_name'] || 'N/A'}</td>
                        <td class="text-right">
                            <button class="btn btn-primary btn-sm btn-edit" 
                                data-id="${airport['airport_id']}" 
                                data-name="${airport['airport_name']}" 
                                data-iata="${airport['iata_code']}" 
                                data-city="${airport['city_id']}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm btn-delete" data-id="${airport['airport_id']}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            airportsList.html(rows || '<tr><td colspan="6" class="text-center p-4 text-muted">No airports found</td></tr>');

            // Action Bindings
            $('.btn-edit').on('click', function () {
                const btn = $(this);
                $('#airport_id').val(btn.data('id'));
                $('#airport_name').val(btn.data('name'));
                $('#airport_iata').val(btn.data('iata'));
                $('#airport_city').val(btn.data('city'));
                $('#modal_title').text('Edit Airport');
                airportModal.modal('show');
            });

            $('.btn-delete').on('click', function () {
                const id = $(this).data('id');
                if (confirm('Are you sure you want to delete this airport?')) {
                    $.post('controllers/airport_ops.php', { deleteairport: true, airportid: id }, function (res) {
                        if (res.status === 'success') {
                            loadAirports();
                            showNotification(filterNotifications, 'success', res.message);
                        } else {
                            showNotification(filterNotifications, 'danger', res.message || 'Failed to delete airport');
                        }
                    }, 'json').fail(function (res) {
                        showNotification(filterNotifications, 'danger', 'Error deleting airport: ' + (res.statusText || 'Unknown error'));
                    });
                }
            });
            },
            error: function (xhr, status, error) {
                const errorMsg = xhr.responseText || error || 'Unknown error';
                showNotification(filterNotifications, 'danger', 'Error loading airports: ' + errorMsg.substring(0, 100));
                airportsList.html('<tr><td colspan="6" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveAirport() {
        const id = $('#airport_id').val();
        const cityId = modalCity.val();
        const name = $('#airport_name').val();
        const iata = $('#airport_iata').val();

        if (!cityId || !name || !iata) {
            showNotification(modalNotifications, 'danger', 'Please fill all fields');
            return;
        }

        const payload = {
            airportid: id,
            cityid: cityId,
            airportname: name,
            iata: iata
        };

        if (id == 0) {
            payload.saveairport = true;
        } else {
            payload.updateairport = true;
        }

        $.post('controllers/airport_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', res.message || 'Saved successfully');
                loadAirports();
                setTimeout(() => airportModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Server error: ' + res.responseText);
        });
    }

    function resetModal() {
        $('#airport_id').val('0');
        $('#airport_name').val('');
        $('#airport_iata').val('');
        modalCity.val('');
        $('#modal_title').text('Add New Airport');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
