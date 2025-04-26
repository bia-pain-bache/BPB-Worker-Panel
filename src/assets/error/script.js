localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
const params = new URLSearchParams(window.location.href);
const errorMessage = params.get('message');
const errorStack = params.get('stack');
document.getElementById("error").innerHTML = `⚠️ ${ errorStack || errorMessage }`;
