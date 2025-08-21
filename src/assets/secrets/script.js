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

    // 将三个值合并为一个.env格式的文本
    const credentialsText = `UUID=${uuid}
TR_PASS=${password}
SUB_PATH=${uriPath}`;

    document.getElementById('credentials').value = credentialsText;
}

window.copyToClipboard = function (elementId) {
    const textToCopy = document.getElementById(elementId).value;
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('✅ Copied to clipboard!'))
        .catch(err => console.error('Failed to copy text:', err));
}