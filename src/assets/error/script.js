localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
const params = new URLSearchParams(window.location.search);
const errorMessage = params.get('message');
document.getElementById("error").innerHTML = `⚠️ ${errorMessage}`;
