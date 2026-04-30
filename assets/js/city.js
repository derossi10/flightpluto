$(document).ready(function () {
    // Constants for frequently used elements
    const filterCountry = $('#filter_country');
    const modalCountry = $('#city_country');
    const citiesList = $('#cities_list');
    const cityModal = $('#city_modal');
    const modalNotifications = $('#modal_notifications');
    const filterNotifications = $('#filter_notifications');

    // Load initial data
    loadCountries(filterCountry, 'All');
    loadCountries(modalCountry, 'Choose');
    loadCities();

    // Event Listeners
    $('#btn_add_city').on('click', function () {
        resetModal();
        cityModal.modal('show');
    });

    $('#btn_save_city').on('click', function () {
        saveCity();
    });

    $('#btn_search_cities').on('click', function () {
        loadCities();
    });

    // Clear notifications on input
    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    // Functions
    function loadCountries(target, firstOption) {
        $.getJSON('controllers/country_ops.php?getcountries=true', function (data) {
            let options = `<option value="">-- ${firstOption} --</option>`;
            data.forEach(country => {
                // Using column names with spaces as returned by the API
                options += `<option value="${country['country_id']}">${country['country_name']}</option>`;
            });
            target.html(options);
        }).fail(function (res) {
            showError(filterNotifications, "Error loading countries: " + res.statusText);
        });
    }

    function loadCities() {
        const countryId = filterCountry.val();
        const cityName = $('#filter_city_name').val();

        let url = 'controllers/city_ops.php?getcities=true';
        if (countryId) url += '&countryid=' + countryId;
        if (cityName) url += '&cityname=' + cityName;

        $.getJSON(url, function (data) {
            let rows = '';
            data.forEach((city, index) => {
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${city['country_name']}</td>
                        <td>${city['city_name']}</td>
                        <td>0</td>
                        <td>0</td>
                        <td class="text-right">
                            <button class="btn btn-primary btn-sm btn-edit" data-id="${city['city_id']}" data-name="${city['city_name']}" data-country="${city['country_id']}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            citiesList.html(rows);

            // Bind edit buttons
            $('.btn-edit').on('click', function () {
                const id = $(this).data('id');
                const name = $(this).data('name');
                const country = $(this).data('country');

                $('#city_id').val(id);
                $('#city_name').val(name);
                $('#city_country').val(country);
                $('#modal_title').text('Edit City');
                cityModal.modal('show');
            });
        }).fail(function (res) {
            showError(filterNotifications, "Error loading cities.");
        });
    }

    function saveCity() {
        const cityId = $('#city_id').val();
        const countryId = modalCountry.val();
        const cityName = $('#city_name').val();

        if (!countryId) {
            showError(modalNotifications, "Please select a country.");
            return;
        }
        if (!cityName) {
            showError(modalNotifications, "Please enter a city name.");
            return;
        }

        const payload = {
            savecity: true,
            cityid: cityId,
            countryid: countryId,
            cityname: cityName
        };

        // If cityId > 0, we use update
        if (cityId > 0) {
            payload.updatecity = true;
            delete payload.savecity;
        }

        $.post('controllers/city_ops.php', payload, function (data) {
            // The API returns a string message if it's already exists, or an array if successful
            // We need to check if it's a success or error
            if (data.status === 'error' || data === 'City already exists') {
                showError(modalNotifications, data.message || data);
            } else {
                showSuccess(modalNotifications, "City saved successfully!");
                loadCities();
                setTimeout(() => {
                    cityModal.modal('hide');
                }, 1500);
            }
        }, 'json').fail(function (res) {
            showError(modalNotifications, "Server error: " + res.responseText);
        });
    }

    function resetModal() {
        $('#city_id').val('0');
        $('#city_name').val('');
        modalCountry.val('');
        $('#modal_title').text('Add New City');
        modalNotifications.html('');
    }

    function showError(target, msg) {
        target.html(`<div class="alert alert-danger py-2 small"><i class="fas fa-exclamation-circle mr-2"></i>${msg}</div>`);
    }

    function showSuccess(target, msg) {
        target.html(`<div class="alert alert-success py-2 small"><i class="fas fa-check-circle mr-2"></i>${msg}</div>`);
    }
});
