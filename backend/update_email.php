<?php
include 'db_connect.php';

$email = $_POST['email'];

// Assume admin user is always the target
$sql = "UPDATE users SET email='$email' WHERE username='admin'";
if ($conn->query($sql) === TRUE) {
    echo "Email updated!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
