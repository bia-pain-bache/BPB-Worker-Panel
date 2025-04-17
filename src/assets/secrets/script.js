localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
generateCredentials();

function generateUUID() {
    return crypto.randomUUID();
}

function generateStrongPassword() {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
    let password = '';
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < 16; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    return password;
}

function generateSubURIPath() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.";
    let uriPath = '';
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < 16; i++) {
        uriPath += charset[randomValues[i] % charset.length];
    }
    return uriPath;
}

function generateCredentials() {
    const uuid = generateUUID();
    const password = generateStrongPassword();
    const uriPath = generateSubURIPath();

    document.getElementById('uuid').textContent = uuid;
    document.getElementById('tr-password').textContent = password;
    document.getElementById('sub-path').textContent = uriPath;
}

function copyToClipboard(elementId) {
    const textToCopy = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('✅ Copied to clipboard!'))
        .catch(err => console.error('Failed to copy text:', err));
}