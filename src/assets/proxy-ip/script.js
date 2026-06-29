localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
loadGeoData();

async function loadGeoData() {
    const tableBody = document.querySelector("#geo-table tbody");

    try {
        const res = await fetch("/proxy-ip/get");
        const { success, body, message } = await res.json();

        if (!success) {
            throw new Error(`Fetching Proxy IPs failed at ${res.url} - ${message}`);
        }

        if (!body.length) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.setAttribute('colspan', '5');
            cell.textContent = 'Failed to get Proxy IPs';
            row.appendChild(cell);
            tableBody.innerHTML = '';
            tableBody.appendChild(row);
            return;
        }

        tableBody.innerHTML = '';

        body.forEach((item, index) => {
            const row = document.createElement('tr');

            const indexCell = document.createElement('td');
            indexCell.textContent = String(index + 1);
            row.appendChild(indexCell);

            const ipCell = document.createElement('td');
            const copyIcon = document.createElement('span');
            copyIcon.className = 'material-symbols-rounded';
            copyIcon.textContent = 'content_copy';
            copyIcon.addEventListener('click', () => copyToClipboard(item.ip));
            const ipText = document.createTextNode(` ${item.ip || '-'}`);
            ipCell.appendChild(copyIcon);
            ipCell.appendChild(ipText);
            row.appendChild(ipCell);

            const countryCell = document.createElement('td');
            const flag = item.countryCode
                ? String.fromCodePoint(...[...item.countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
                : '';
            countryCell.textContent = `${flag} ${item.country || '-'}`;
            row.appendChild(countryCell);

            const cityCell = document.createElement('td');
            cityCell.textContent = item.city || '-';
            row.appendChild(cityCell);

            const ispCell = document.createElement('td');
            ispCell.textContent = item.isp || '-';
            row.appendChild(ispCell);

            tableBody.appendChild(row);
        });

    } catch (err) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '5');
        cell.textContent = `Error: ${err.message}`;
        row.appendChild(cell);
        tableBody.innerHTML = '';
        tableBody.appendChild(row);
        console.error(err);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('✅ Copied to clipboard:\n\n' + text))
        .catch(error => console.error('Failed to copy:', error));
}
