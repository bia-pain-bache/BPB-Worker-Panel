localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
const params = new URLSearchParams(window.location.search);
const errorString = params.get('error');
document.getElementById("error").innerHTML = `⚠️ ${errorString}`;
