$(document).ready(function () {
    // Selectors
    const filterCountry = $('#filter_country');
    const modalCountry = $('#airline_country');
    const airlinesList = $('#airlines_list');
    const airlineModal = $('#airline_modal');
    const modalNotifications = $('#modal_notifications');
    const filterNotifications = $('#filter_notifications');

    // Initial Load
    loadCountries(filterCountry, 'All Countries');
    loadCountries(modalCountry, 'Select Country');
    loadAirlines();

    // Event Listeners
    $('#btn_add_airline').on('click', function () {
        resetModal();
        airlineModal.modal('show');
    });

    $('#btn_save_airline').on('click', function () {
        saveAirline();
    });

    $('#btn_search_airlines').on('click', function () {
        loadAirlines();
    });

    // Clear notifications on input
    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    // Load countries for dropdowns
    function loadCountries(target, firstOption) {
        $.getJSON('controllers/country_ops.php?getcountries=true', function (data) {
            let options = `<option value="">-- ${firstOption} --</option>`;
            data.forEach(country => {
                options += `<option value="${country['country_id']}">${country['country_name']}</option>`;
            });
            target.html(options);
        });
    }

    // Fetch and display airlines
    function loadAirlines() {
        const countryId = filterCountry.val();
        const airlineName = $('#filter_airline_name').val();

        let url = 'controllers/airline_ops.php?getairlines=true';
        
        $.getJSON(url, function (data) {
            let filteredData = data;
            
            if (countryId) {
                filteredData = filteredData.filter(a => a.country_id == countryId);
            }
            if (airlineName) {
                const search = airlineName.toLowerCase();
                filteredData = filteredData.filter(a => 
                    a.airline_name.toLowerCase().includes(search) || 
                    a.iata_code.toLowerCase().includes(search) ||
                    a.icao_code.toLowerCase().includes(search)
                );
            }

            let rows = '';
            filteredData.forEach((airline, index) => {
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${airline['airline_name']}</td>
                        <td><span class="badge badge-primary badge-pill">${airline['iata_code']}</span></td>
                        <td><span class="badge badge-secondary badge-pill">${airline['icao_code']}</span></td>
                        <td>${airline['country_name'] || 'N/A'}</td>
                        <td class="text-right">
                            <button class="btn btn-primary btn-sm btn-edit" 
                                data-id="${airline['airline_id']}" 
                                data-name="${airline['airline_name']}" 
                                data-iata="${airline['iata_code']}" 
                                data-icao="${airline['icao_code']}" 
                                data-country="${airline['country_id']}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm btn-delete" data-id="${airline['airline_id']}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            airlinesList.html(rows || '<tr><td colspan="6" class="text-center p-4 text-muted">No airlines found</td></tr>');

            // Action Bindings
            $('.btn-edit').on('click', function () {
                const btn = $(this);
                $('#airline_id').val(btn.data('id'));
                $('#airline_name').val(btn.data('name'));
                $('#airline_iata').val(btn.data('iata'));
                $('#airline_icao').val(btn.data('icao'));
                $('#airline_country').val(btn.data('country'));
                $('#modal_title').text('Edit Airline');
                airlineModal.modal('show');
            });

            $('.btn-delete').on('click', function () {
                const id = $(this).data('id');
                if (confirm('Are you sure you want to delete this airline?')) {
                    $.post('controllers/airline_ops.php', { deleteairline: true, airlineid: id }, function (res) {
                        if (res.status === 'success') {
                            loadAirlines();
                            showNotification(filterNotifications, 'success', res.message);
                        }
                    }, 'json');
                }
            });
        });
    }

    function saveAirline() {
        const id = $('#airline_id').val();
        const countryId = modalCountry.val();
        const name = $('#airline_name').val();
        const iata = $('#airline_iata').val();
        const icao = $('#airline_icao').val();

        if (!countryId || !name || !iata || !icao) {
            showNotification(modalNotifications, 'danger', 'Please fill all fields');
            return;
        }

        const payload = {
            airlineid: id,
            countryid: countryId,
            airlinename: name,
            iata: iata,
            icao: icao
        };

        if (id == 0) {
            payload.saveairline = true;
        } else {
            payload.updateairline = true;
        }

        $.post('controllers/airline_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', res.message || 'Saved successfully');
                loadAirlines();
                setTimeout(() => airlineModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Server error: ' + res.responseText);
        });
    }

    function resetModal() {
        $('#airline_id').val('0');
        $('#airline_name').val('');
        $('#airline_iata').val('');
        $('#airline_icao').val('');
        modalCountry.val('');
        $('#modal_title').text('Add New Airline');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
