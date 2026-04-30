/**
 * Shared Security Script for FlightPluto
 * Include this at the top of every page's JS to enforce access control.
 */
function enforceSecurity(requiredModule) {
    $.getJSON('controllers/user_ops.php?getsession=true', function (res) {
        if (res.status !== 'success') {
            window.location.href = 'login.html';
            return;
        }

        const user = res.user;
        const privileges = res.privileges;

        if (user.is_admin == 1) return; // Admins have bypass

        const access = privileges.find(p => p.object_code === requiredModule);
        if (!access || access.has_access != 1) {
            alert('Access Denied: You do not have permission for this module.');
            window.location.href = 'index.html';
        }
    }).fail(function() {
        window.location.href = 'login.html';
    });
}
