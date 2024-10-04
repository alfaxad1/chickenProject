// Handles the login functionality
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication check
    if (username === '12687828' && password === 'Nasinyama74') {
        // Redirect to the dashboard page
        window.location.href = 'dashboard.html';
    } else {
        alert('Incorrect username or password.');
    }
});
