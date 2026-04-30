<?php
header('Content-Type: application/json');
require_once("../models/user.php");
$user = new User();

if (isset($_POST['saveuser'])) {
    $user_id = $_POST['user_id'];
    $username = $_POST['username'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $password = $_POST['password'];
    $mobile = $_POST['mobile'];
    $email = $_POST['email'];
    $system_admin = $_POST['system_admin'];

    // Generate Salt and Hash Password
    $salt = generateRandomString(20);
    $hashed_password = hash('sha256', $password . $salt);

    // Use session user_id if logged in, otherwise default to 1 (for first user creation)
    $added_by = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1;

    echo $user->saveUser($user_id, $username, $first_name, $last_name, $hashed_password, $salt, $mobile, $email, $system_admin, $added_by);
}

if (isset($_POST['login'])) {
    echo $user->login($_POST['username'], $_POST['password']);
}

if (isset($_GET['getprivileges'])) {
    echo $user->getUserPrivileges($_GET['user_id']);
}

if (isset($_POST['saveprivilege'])) {
    $added_by = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1;
    echo $user->savePrivilege($_POST['user_id'], $_POST['object_id'], $_POST['valid'], $added_by);
}

if (isset($_GET['getsession'])) {
    if (isset($_SESSION['user_id'])) {
        // Fetch latest privileges too
        $privileges = $user->getUserPrivileges($_SESSION['user_id']);
        echo json_encode([
            "status" => "success",
            "user" => $_SESSION,
            "privileges" => json_decode($privileges)
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No active session"]);
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    echo json_encode(["status" => "success", "message" => "Logged out"]);
}

if (isset($_GET['getusers'])) {
    echo $user->getUsers();
}

if (isset($_GET['getuserdetails'])) {
    echo $user->getUserDetails($_GET['user_id']);
}
?>
