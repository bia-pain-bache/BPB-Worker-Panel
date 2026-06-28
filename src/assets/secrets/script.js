if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

let uuid, password, uriPath;
generateCredentials();

function generateUUID() {
    return crypto.randomUUID();
}

function generateStrongPassword() {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
    let result = '';
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < 16; i++) {
        result += charset[randomValues[i] % charset.length];
    }
    return result;
}

function generateSubURIPath() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.";
    let result = '';
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < 16; i++) {
        result += charset[randomValues[i] % charset.length];
    }
    return result;
}

function generateCredentials() {
    uuid = generateUUID();
    password = generateStrongPassword();
    uriPath = generateSubURIPath();

    document.getElementById('uuid').textContent = uuid;
    document.getElementById('tr-password').textContent = password;
    document.getElementById('sub-path').textContent = uriPath;
}

window.copyToClipboard = function (elementId = null) {
    const textToCopy = elementId !== null
        ? document.getElementById(elementId).textContent
        : `UUID=${uuid}\nTR_PASS=${password}\nSUB_PATH=${uriPath}`;

    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('✅ Copied to clipboard!'))
        .catch(err => console.error('Failed to copy text:', err));
};