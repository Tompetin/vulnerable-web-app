const comments = [];

// XSS Vulnerability: Handle comments
document.getElementById('commentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentInput = document.getElementById('commentInput').value;
    
    // Debugging: log the input to the console
    console.log("Comment submitted:", commentInput);

    // Add the comment directly to the page (unsafe)
    document.getElementById('commentsContainer').innerHTML += `<div>${commentInput}</div>`;

    // Debugging: log the updated comments container
    console.log("Updated comments container:", document.getElementById('commentsContainer').innerHTML);

    // Clear input after submission
    document.getElementById('commentInput').value = '';
});


// Login Vulnerability: No hashing or brute force prevention
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Use fetch to send the data to the server
    fetch('backend/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())  // Get the response text (either success or failure)
    .then(data => {
        // Show the response message
        document.getElementById('loginMessage').textContent = data;
    })
    .catch(error => console.error('Error:', error));  // Handle errors
});


// CSRF Vulnerability: Update email without validation
document.getElementById('csrfForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    // Assume user is "admin" for simplicity
    const admin = users.find((u) => u.username === 'admin');
    if (admin) {
        admin.email = email;
        document.getElementById('csrfMessage').textContent = `Email updated to: ${email}`;
    }
});
