<?php
include 'db_connect.php';

$comment = $_POST['comment'];

// Vulnerable to XSS: No sanitization or escaping
$sql = "INSERT INTO comments (comment) VALUES ('$comment')";
if ($conn->query($sql) === TRUE) {
    echo "Comment submitted!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
