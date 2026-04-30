$(document).ready(function () {
    // Selectors
    const existingUsers = $('#existing_users');
    const userIdField = $('#user_id');
    const userNotifications = $('#user_notifications');

    // Initial Load
    loadUsers();

    // Event Listeners
    $('#btn_save_user').on('click', function () {
        saveUser();
    });

    $('#btn_clear_fields').on('click', function () {
        resetForm();
    });

    existingUsers.on('change', function () {
        const userId = $(this).val();
        if (userId) {
            loadUserDetails(userId);
            loadUserPrivileges(userId);
        }
    });

    // Functions
    function loadUsers() {
        $.getJSON('controllers/user_ops.php?getusers=true', function (data) {
            let options = '';
            data.forEach(user => {
                options += `<option value="${user.user_id}">${user.first_name} ${user.last_name} (${user.username})</option>`;
            });
            existingUsers.html(options);
        });
    }

    function loadUserDetails(id) {
        $.getJSON(`controllers/user_ops.php?getuserdetails=true&user_id=${id}`, function (data) {
            const user = Array.isArray(data) ? data[0] : data;
            if (user) {
                userIdField.val(user.user_id);
                $('#username').val(user.username);
                $('#first_name').val(user.first_name);
                $('#last_name').val(user.last_name);
                $('#mobile').val(user.mobile);
                $('#email').val(user.email);
                $('#system_admin').val(user.system_admin);
                $('#password').val(''); // Don't show hashed password
                $('#confirm_password').val('');
                userNotifications.html('');
            }
        });
    }

    function loadUserPrivileges(id) {
        $.getJSON(`controllers/user_ops.php?getprivileges=true&user_id=${id}`, function (data) {
            let rows = '';
            data.forEach(priv => {
                const checked = priv.has_access == 1 ? 'checked' : '';
                rows += `
                    <tr>
                        <td>${priv.object_name}</td>
                        <td><span class="badge badge-secondary">${priv.object_code}</span></td>
                        <td class="text-center">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input privilege-toggle" 
                                    id="priv_${priv.object_id}" data-objid="${priv.object_id}" ${checked}>
                                <label class="custom-control-label" for="priv_${priv.object_id}"></label>
                            </div>
                        </td>
                    </tr>
                `;
            });
            $('#privileges_list').html(rows);

            // Bind toggle event
            $('.privilege-toggle').on('change', function() {
                const objId = $(this).data('objid');
                const valid = $(this).is(':checked') ? 1 : 0;
                savePrivilege(id, objId, valid);
            });
        });
    }

    function savePrivilege(userId, objId, valid) {
        $.post('controllers/user_ops.php', {
            saveprivilege: true,
            user_id: userId,
            object_id: objId,
            valid: valid
        }, function(res) {
            if (res.status !== 'success') {
                showNotification(userNotifications, 'danger', 'Failed to update privilege');
            }
        }, 'json');
    }

    function saveUser() {
        const password = $('#password').val();
        const confirmPassword = $('#confirm_password').val();

        if (password !== confirmPassword) {
            showNotification(userNotifications, 'danger', 'Passwords do not match');
            return;
        }

        const payload = {
            saveuser: true,
            user_id: userIdField.val(),
            username: $('#username').val(),
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            password: password,
            mobile: $('#mobile').val(),
            email: $('#email').val(),
            system_admin: $('#system_admin').val()
        };

        if (!payload.username || !payload.first_name || !payload.password) {
            showNotification(userNotifications, 'danger', 'Please fill in all required fields');
            return;
        }

        $.post('controllers/user_ops.php', payload, function (res) {
            if (res.status === 'success') {
                showNotification(userNotifications, 'success', res.message);
                loadUsers();
                if (payload.user_id == 0) resetForm();
            } else {
                showNotification(userNotifications, 'danger', res.message);
            }
        }, 'json');
    }

    function resetForm() {
        userIdField.val('0');
        $('input').val('');
        $('#system_admin').val('0');
        userNotifications.html('');
    }

    function showNotification(target, type, msg) {
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        target.html(`<div class="alert alert-${type} py-2 small animate-fadeIn"><i class="fas fa-${icon} mr-2"></i>${msg}</div>`);
    }
});
