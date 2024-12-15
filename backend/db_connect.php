<?php
$servername = "localhost";
$username = "root";
$password = ""; // Replace with your MySQL root password
$dbname = "vulnerablewebapp";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
