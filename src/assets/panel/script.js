function addUdpNoise(isManual, noiseIndex, udpNoise) {
    const index = noiseIndex ?? globalThis.xrayNoiseCount;
    const noise = udpNoise || {
        type: 'rand',
        packet: '50-100',
        delay: '1-5',
        count: 5
    };

    const container = document.createElement('div');
    container.className = 'inner-container';
    container.id = `udp-noise-${index + 1}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'header-container';

    const heading = document.createElement('h4');
    heading.textContent = `Noise ${index + 1}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-noise';
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'material-symbols-rounded';
    deleteIcon.textContent = 'delete';
    deleteBtn.appendChild(deleteIcon);

    headerDiv.appendChild(heading);
    headerDiv.appendChild(deleteBtn);
    container.appendChild(headerDiv);

    const section = document.createElement('div');
    section.className = 'section';

    const modeControl = createFormControl('Mode');
    const modeSelect = document.createElement('select');
    modeSelect.name = 'udpXrayNoiseMode';
    [
        ['base64', 'Base64'],
        ['rand', 'Random'],
        ['str', 'String'],
        ['hex', 'Hex'],
        ['array', 'Array']
    ].forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        option.selected = noise.type === value;
        modeSelect.appendChild(option);
    });
    modeControl.querySelector('div').appendChild(modeSelect);
    section.appendChild(modeControl);

    const packetControl = createFormControl('Packet');
    const packetInput = document.createElement('input');
    packetInput.type = 'text';
    packetInput.name = 'udpXrayNoisePacket';
    packetInput.value = noise.packet;
    packetControl.querySelector('div').appendChild(packetInput);
    section.appendChild(packetControl);

    const countControl = createFormControl('Count');
    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.name = 'udpXrayNoiseCount';
    countInput.value = String(noise.count);
    countInput.min = '1';
    countInput.required = true;
    countControl.querySelector('div').appendChild(countInput);
    section.appendChild(countControl);

    const delayControl = createFormControl('Delay');
    const minMaxDiv = document.createElement('div');
    minMaxDiv.className = 'min-max';

    const [delayMin, delayMax] = noise.delay.split('-');

    const delayMinInput = document.createElement('input');
    delayMinInput.type = 'number';
    delayMinInput.name = 'udpXrayNoiseDelayMin';
    delayMinInput.value = delayMin;
    delayMinInput.min = '1';
    delayMinInput.required = true;

    const separator = document.createElement('span');
    separator.textContent = ' - ';

    const delayMaxInput = document.createElement('input');
    delayMaxInput.type = 'number';
    delayMaxInput.name = 'udpXrayNoiseDelayMax';
    delayMaxInput.value = delayMax;
    delayMaxInput.min = '1';
    delayMaxInput.required = true;

    minMaxDiv.appendChild(delayMinInput);
    minMaxDiv.appendChild(separator);
    minMaxDiv.appendChild(delayMaxInput);
    delayControl.querySelector('div').appendChild(minMaxDiv);
    section.appendChild(delayControl);

    container.appendChild(section);

    deleteBtn.addEventListener('click', deleteUdpNoise);
    modeSelect.addEventListener('change', generateUdpNoise);

    document.getElementById('noises').append(container);
    if (isManual) enableApplyButton();
    globalThis.xrayNoiseCount++;
}

function createFormControl(labelText) {
    const control = document.createElement('div');
    control.className = 'form-control';

    const label = document.createElement('label');
    label.textContent = labelText;

    const inputWrapper = document.createElement('div');

    control.appendChild(label);
    control.appendChild(inputWrapper);
    return control;
}

function renderPortsBlock(ports) {
    let noneTlsPortsBlock = document.createDocumentFragment();
    let tlsPortsBlock = document.createDocumentFragment();

    const totalPorts = [
        ...(window.origin.includes('workers.dev') ? defaultHttpPorts : []),
        ...defaultHttpsPorts
    ];

    totalPorts.forEach(port => {
        const isChecked = ports.includes(port);
        const isHttpsPort = defaultHttpsPorts.includes(port);

        const wrapper = document.createElement('div');
        wrapper.className = 'routing';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = String(port);
        checkbox.value = 'true';
        checkbox.checked = isChecked;

        if (isHttpsPort) {
            checkbox.className = 'https';
            checkbox.addEventListener('click', handlePortChange);
        }

        const label = document.createElement('label');
        label.textContent = String(port);

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        if (isHttpsPort) {
            tlsPortsBlock.appendChild(wrapper);
        } else {
            noneTlsPortsBlock.appendChild(wrapper);
        }
    });

    const tlsContainer = document.getElementById('tls-ports');
    tlsContainer.innerHTML = '';
    tlsContainer.appendChild(tlsPortsBlock);

    const nonTlsContainer = document.getElementById('non-tls-ports');
    if (noneTlsPortsBlock.childElementCount > 0) {
        nonTlsContainer.innerHTML = '';
        nonTlsContainer.appendChild(noneTlsPortsBlock);
        document.getElementById('none-tls').style.display = 'flex';
    }
}