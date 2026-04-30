$(document).ready(function () {
    // Check Session and Load Privileges
    checkAccess();

    $('#btn_logout').on('click', function () {
        $.getJSON('controllers/user_ops.php?logout=true', function () {
            window.location.href = 'login.html';
        });
    });

    function checkAccess() {
        $.getJSON('controllers/user_ops.php?getsession=true', function (res) {
            if (res.status === 'success') {
                const user = res.user;
                const privileges = res.privileges;

                // Update UI with user details
                $('#user_display_name').text(user.full_name);
                $('#user_role').text(user.is_admin == 1 ? 'System Administrator' : 'Staff Member');

                // Enforce Privileges
                $('.module-card').each(function () {
                    const moduleCode = $(this).data('priv');
                    
                    // Check if user has privilege for this module
                    const access = privileges.find(p => p.object_code === moduleCode);
                    
                    // If admin or specifically granted, show it
                    if (user.is_admin == 1 || (access && access.has_access == 1)) {
                        $(this).css('display', 'block');
                    }
                });

                // If no modules are visible (very restrictive), show a message
                if ($('.module-card:visible').length === 0) {
                    $('#module_container').html(`
                        <div class="col-12 text-center p-5 animate-fadeIn">
                            <i class="fas fa-lock fa-3x mb-3 text-muted"></i>
                            <h4>Access Restricted</h4>
                            <p class="text-muted">You do not have permission to access any modules. Please contact an administrator.</p>
                        </div>
                    `);
                }

            } else {
                // Redirect to login if no session
                window.location.href = 'login.html';
            }
        }).fail(function () {
            window.location.href = 'login.html';
        });
    }
});
