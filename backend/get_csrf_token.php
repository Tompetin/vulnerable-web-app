<?php
session_start();

// Generate a CSRF token if it doesn't exist
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Check what is being sent to the client
header('Content-Type: application/json');

// Debugging: Log errors or unexpected output
if (headers_sent()) {
    error_log("Headers already sent. Potential unexpected output.");
}

echo json_encode(['csrfToken' => $_SESSION['csrf_token']]);
