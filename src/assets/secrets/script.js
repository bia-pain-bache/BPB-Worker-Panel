localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
generateCredentials();
let uuid, password, uriPath;

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
    uuid = generateUUID();
    password = generateStrongPassword();
    uriPath = generateSubURIPath();

    document.getElementById('uuid').textContent = uuid;
    document.getElementById('tr-password').textContent = password;
    document.getElementById('sub-path').textContent = uriPath;
}

window.copyToClipboard = function (elementId) {
    const textToCopy = elementId 
        ? document.getElementById(elementId).textContent
        : `UUID=${uuid}\nTR_PASS=${password}\nSUB_PATH=${uriPath}`;

    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('✅ Copied to clipboard!'))
        .catch(err => console.error('Failed to copy text:', err));
}