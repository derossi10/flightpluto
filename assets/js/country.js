$(document).ready(function () {
    const filterNotifications = $('#filter_notifications');
    const modalNotifications = $('#modal_notifications');
    const countriesList = $('#countries_list');
    const countryModal = $('#country_modal');

    loadCountries();

    $('#btn_add_country').on('click', function () {
        resetModal();
        countryModal.modal('show');
    });

    $('#btn_save_country').on('click', function () {
        saveCountry();
    });

    $('#btn_search_countries').on('click', function () {
        loadCountries();
    });

    $('input, select').on('input change', function () {
        modalNotifications.html('');
        filterNotifications.html('');
    });

    function loadCountries() {
        const countryName = $('#filter_country_name').val();
        let url = 'controllers/country_ops.php?getcountries=true';
        if (countryName) url += '&countryname=' + countryName;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                let rows = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((country, index) => {
                        rows += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${country['country_name']}</td>
                                <td><span class="badge badge-info">${country['country_code']}</span></td>
                                <td class="text-right">
                                    <button class="btn btn-primary btn-sm btn-edit" data-id="${country['country_id']}" data-name="${country['country_name']}" data-code="${country['country_code']}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${country['country_id']}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    rows = '<tr><td colspan="4" class="text-center p-4 text-muted">No countries found</td></tr>';
                }
                countriesList.html(rows);

                $('.btn-edit').on('click', function () {
                    const id = $(this).data('id');
                    const name = $(this).data('name');
                    const code = $(this).data('code');

                    $('#country_id').val(id);
                    $('#country_name').val(name);
                    $('#country_code').val(code);
                    $('#modal_title').text('Edit Country');
                    countryModal.modal('show');
                });

                $('.btn-delete').on('click', function () {
                    const id = $(this).data('id');
                    if (confirm('Are you sure you want to delete this country?')) {
                        $.post('controllers/country_ops.php', { deletecountry: true, countryid: id }, function (res) {
                            if (res.status === 'success') {
                                loadCountries();
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
                showNotification(filterNotifications, 'danger', 'Error loading countries: ' + errorMsg.substring(0, 100));
                countriesList.html('<tr><td colspan="4" class="text-center p-4 text-danger">Error loading data</td></tr>');
            }
        });
    }

    function saveCountry() {
        const id = $('#country_id').val();
        const name = $('#country_name').val();
        const code = $('#country_code').val();

        if (!name || !code) {
            showNotification(modalNotifications, 'danger', 'Please fill all fields');
            return;
        }

        const payload = {
            countryid: id,
            countryname: name,
            countrycode: code
        };

        if (id == 0) {
            payload.savecountry = true;
        } else {
            payload.updatecountry = true;
        }

        $.post('controllers/country_ops.php', payload, function (res) {
            if (res.status === 'success' || (typeof res === 'string' && res.includes('successfully'))) {
                showNotification(modalNotifications, 'success', 'Country saved successfully');
                loadCountries();
                setTimeout(() => countryModal.modal('hide'), 1000);
            } else {
                showNotification(modalNotifications, 'danger', res.message || res);
            }
        }, 'json').fail(function (res) {
            showNotification(modalNotifications, 'danger', 'Error saving: ' + (res.statusText || 'Unknown error'));
        });
    }

    function resetModal() {
        $('#country_id').val('0');
        $('#country_name').val('');
        $('#country_code').val('');
        $('#modal_title').text('Add Country');
        modalNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
