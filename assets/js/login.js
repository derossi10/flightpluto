$(document).ready(function () {
    $('#login_form').on('submit', function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();
        const notification = $('#login_notifications');

        $.post('controllers/user_ops.php', {
            login: true,
            username: username,
            password: password
        }, function (res) {
            if (res.status === 'success') {
                notification.html(`<div class="alert alert-success py-2 small">Login successful! Redirecting...</div>`);
                setTimeout(() => {
                    window.location.href = 'index.html'; // Or dashboard.html
                }, 1000);
            } else {
                notification.html(`<div class="alert alert-danger py-2 small">${res.message}</div>`);
            }
        }, 'json').fail(function() {
            notification.html(`<div class="alert alert-danger py-2 small">Connection error. Please try again.</div>`);
        });
    });
});
