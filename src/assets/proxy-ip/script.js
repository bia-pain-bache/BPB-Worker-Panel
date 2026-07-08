loadGeoData();

async function loadGeoData() {
    const tableBody = document.querySelector("#geo-table tbody");

    try {
        const res = await fetch("./proxy-ip/get");
        const { success, body, message } = await res.json();

        if (!success) {
            throw new Error(`Fetching Proxy IPs failed at ${res.url} - ${message}`);
        }

        if (!body.length) {
            const cell = elm('td', {
                textContent: 'Failed to get Proxy IPs',
                colSpan: '5'
            });
            const row = elm('tr', {}, [cell]);

            tableBody.innerHTML = '';
            tableBody.appendChild(row);
            return;
        }

        tableBody.innerHTML = '';

        body.forEach((item, index) => {
            const indexCell = elm('td', { textContent: String(index + 1) });

            const copyIcon = createIcon('content_copy', 'Copy to clipboard');
            const ipText = document.createTextNode(` ${item.ip || '-'}`);
            const testIcon = createIcon('flash_on', 'Test IP');
            const ipCell = elm('td', {}, [copyIcon, ipText, testIcon]);

            const healthRateCell = elm('td', { textContent: '-' });
            const avgLatencyCell = elm('td', { textContent: '-' });
            const flag = item.countryCode
                ? String.fromCodePoint(...[...item.countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
                : '';

            const countryCell = elm('td', { textContent: `${flag} ${item.country || '-'}` });
            const cityCell = elm('td', { textContent: item.city || '-' });
            const ispCell = elm('td', { textContent: item.isp || '-' });

            testIcon.addEventListener('click', () => testIp(item.ip, healthRateCell, avgLatencyCell));
            const row = elm('tr', {}, [indexCell, ipCell, healthRateCell, avgLatencyCell, countryCell, cityCell, ispCell]);
            tableBody.appendChild(row);
        });

    } catch (err) {
        const cell = elm('td', { colSpan: '5', textContent: `Error: ${err.message}` });
        const row = elm('tr', {}, [cell]);
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

function testIp(ip, healthyCell, avgLatencyCell) {
    document.body.classList.add('is-loading');
    fetch(`./proxy-ip/test?target=${ip}`)
        .then(res => res.json())
        .then(({ success, status, message, body }) => {
            if (!success) {
                throw new Error(`Failed with status ${status} - ${message}`);
            }

            const { successRate, avgLatencyMs } = body;
            healthyCell.textContent = successRate;
            avgLatencyCell.textContent = avgLatencyMs;
            document.body.classList.remove('is-loading');
        })
        .catch((error) => console.error(`Failed to test IP: ${error}`));
}

function elm(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.assign(node, props);
    node.append(...[].concat(children));
    return node;
}

const createIcon = (text, title) => elm('span', {
    className: 'material-symbols-rounded',
    textContent: text,
    title
});