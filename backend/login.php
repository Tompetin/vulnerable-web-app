<?php
include 'db_connect.php';

$username = $_POST['username'];
$password = $_POST['password'];

// Vulnerable query: No parameterized queries or hashing
$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Login successful!";
} else {
    echo "Invalid credentials.";
}

$conn->close();
?>
