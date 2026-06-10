(function() {
    const savedTheme = localStorage.getItem('bpb-theme');
    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
})();

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bpb-theme', newTheme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
}

function togglePassword(btn) {
    const input = btn.previousElementSibling;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
}

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('passwordError');
    const submitBtn = event.target.querySelector('.btn-neon');
    const originalText = submitBtn.innerHTML;

    errorEl.textContent = '';
    submitBtn.innerHTML = '⏳ Loading...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/login/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: password
        });

        const { success, status, message } = await response.json();
        if (!success) {
            errorEl.textContent = '⚠️ Wrong Password!';
            throw new Error(`Login failed with status ${status}: ${message}`);
        }

        window.location.href = '/panel';
    } catch (error) {
        console.error('Login error:', error.message || error);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});
