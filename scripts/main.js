// Function to sanitize input and escape harmful characters
function sanitizeInput(input) {
    // Escape basic HTML characters to prevent XSS
    const div = document.createElement('div');
    div.textContent = input; // Use textContent to safely set the input as text
    let sanitizedInput = div.innerHTML; // Return the escaped version of the input

    // Regular expression to block common SQL injection patterns
    const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|--|\bOR\b|\bAND\b|=|;|')\b)/i;
    
    // Check for SQL injection patterns and sanitize
    if (sqlInjectionPattern.test(sanitizedInput)) {
        throw new Error('Potential SQL Injection detected in the input!');
    }

    return sanitizedInput;
}


const comments = [];

// Securely handle comments to prevent XSS
document.getElementById('commentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const commentInput = document.getElementById('commentInput').value;

    // Sanitize the input
    const sanitizedComment = sanitizeInput(commentInput);

    // Add the sanitized comment to the page
    document.getElementById('commentsContainer').innerHTML += `<div>${sanitizedComment}</div>`;

    // Clear the input field after submission
    document.getElementById('commentInput').value = '';
});

const loginAttempts = {}; // Store login attempts per user/IP
const MAX_ATTEMPTS = 10; // Maximum allowed attempts
const LOCKOUT_TIME = 30000; // 30 seconds lockout period

// Login Functionality with Rate Limiting
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    
    // Get the current timestamp
    const now = Date.now();

    // Initialize login attempts for the user
    if (!loginAttempts[username]) {
        loginAttempts[username] = { count: 0, lockUntil: null };
    }

    // Check if the user is locked out
    if (loginAttempts[username].lockUntil && now < loginAttempts[username].lockUntil) {
        const timeRemaining = Math.ceil((loginAttempts[username].lockUntil - now) / 1000);
        document.getElementById('loginMessage').textContent = 
            `Too many unsuccessful attempts. Please try again in ${timeRemaining} seconds.`;
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Use fetch to send the data to the server
    fetch('backend/login.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text()) // Get the response text (either success or failure)
        .then(data => {
            if (data === "Login successful!") {
                // Reset login attempts on successful login
                loginAttempts[username] = { count: 0, lockUntil: null };
                document.getElementById('loginMessage').textContent = `Welcome, ${username}!`;
            } else {
                // Increment the login attempt count
                loginAttempts[username].count += 1;

                if (loginAttempts[username].count >= MAX_ATTEMPTS) {
                    // Lock the user out for the specified lockout time
                    loginAttempts[username].lockUntil = now + LOCKOUT_TIME;
                    document.getElementById('loginMessage').textContent = 
                        `Too many unsuccessful attempts. Please try again in ${LOCKOUT_TIME / 1000} seconds.`;
                } else {
                    const attemptsLeft = MAX_ATTEMPTS - loginAttempts[username].count;
                    document.getElementById('loginMessage').textContent = 
                        `Invalid credentials. You have ${attemptsLeft} attempts remaining.`;
                }
            }
        })
        .catch(error => console.error('Error:', error)); // Handle errors
});


// CSRF Functionality
document.getElementById('csrfForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const csrfToken = localStorage.getItem('csrfToken'); // Retrieve CSRF token

    if (!csrfToken) {
        document.getElementById('csrfMessage').textContent = 'CSRF token not found!';
        return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('csrfToken', csrfToken);

    // Send the email and CSRF token to the server
    fetch('backend/update_email.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('csrfMessage').textContent = data; // Display server response
        })
        .catch(error => console.error('Error:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    // Fetch the CSRF token from the server
    fetch('backend/get_csrf_token.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        if (data.csrfToken) {
           localStorage.setItem('csrfToken', data.csrfToken);
        } else {
            console.error('CSRF token not found in server response');
        }
        const csrfToken = data.csrfToken; // Extract the CSRF token
        document.getElementById('csrfToken').value = csrfToken; // Add it to the hidden input field
    })
    .catch(error => console.error('Error fetching CSRF token:', error));
});
