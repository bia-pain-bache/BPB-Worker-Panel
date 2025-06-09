localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: password
        });

        const { success, status, message } = await response.json();
        if (!success) {
            const passwordError = document.getElementById("passwordError");
            passwordError.textContent = '⚠️ Wrong Password!';
            throw new Error(`Login failed with status ${status}: ${message}`);
        }

        window.location.href = '/panel';
    } catch (error) {
        console.error('Login error:', error.message || error);
    }
});

document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    this.textContent = isPassword ? "visibility_off" : "visibility";
});