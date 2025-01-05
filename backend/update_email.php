<?php
session_start();
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrfToken'];
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    // Validate CSRF token
    if (!isset($_SESSION['csrf_token']) || $csrfToken !== $_SESSION['csrf_token']) {
        echo 'Invalid CSRF token.';
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Invalid email format.';
        exit;
    }

    // Update email for the logged-in user (assume 'admin' for simplicity)
    $stmt = $conn->prepare("UPDATE users SET email = ? WHERE username = ?");
    $stmt->bind_param("ss", $email, $username);

    $username = 'admin'; // Replace with session user or similar authentication mechanism
    if ($stmt->execute()) {
        echo 'Email updated successfully!';
    } else {
        echo 'Failed to update email.';
    }
    $stmt->close();
    $conn->close();
}
?>
