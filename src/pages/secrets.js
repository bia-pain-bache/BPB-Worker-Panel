import { panelVersion, initializeParams } from "../helpers/init";

export async function renderSecretsPage (request, env) {
    await initializeParams(request, env);
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UUID and Password Generator</title>
    <style>
        :root {
            --color: black;
            --primary-color: #09639f;
            --background-color: #fff;
            --container-background-color: #f9f9f9;
            --text-color: #333;
            --border-color: #ddd;
        }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: var(--background-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: var(--container-background-color);
            padding: 20px;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 90%;
            max-width: 400px;
        }
        h1 { color: var(--primary-color); margin-bottom: 20px; }
        .output-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px;
            background-color: #e9e9e9;
            border-radius: 5px;
            font-family: monospace;
            font-size: 1rem;
            word-wrap: break-word;
        }
        .output { flex: 1; margin-right: 10px; overflow-wrap: break-word; }
        .copy-icon {
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--primary-color);
            transition: color 0.2s;
        }
        .copy-icon:hover { color: #2980b9; }
        button {
            margin-top: 15px;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            color: white;
            background-color: var(--primary-color);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover { background-color: #2980b9; }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>BPB Panel <span style="font-size: smaller;">${panelVersion}</span> 💦</h1>
            <div>
                <strong>Random UUID:</strong>
                <div class="output-container">
                    <span id="uuid" class="output"></span>
                    <span class="copy-icon" onclick="copyToClipboard('uuid')">📋</span>
                </div>
            </div>
            <div>
                <strong>Random Trojan Password:</strong>
                <div class="output-container">
                    <span id="trojan-password" class="output"></span>
                    <span class="copy-icon" onclick="copyToClipboard('trojan-password')">📋</span>
                </div>
            </div>
            <button onclick="generateCredentials()">Generate Again</button>
        </div>

        <script>
            function generateUUID() {
                return crypto.randomUUID();
            }

            function generateStrongPassword(length = 16) {
                const charset =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
                let password = '';
                const randomValues = new Uint8Array(length);
                crypto.getRandomValues(randomValues);

                for (let i = 0; i < length; i++) {
                    password += charset[randomValues[i] % charset.length];
                }
                return password;
            }

            function generateCredentials() {
                const uuid = generateUUID();
                const password = generateStrongPassword();

                document.getElementById('uuid').textContent = uuid;
                document.getElementById('trojan-password').textContent = password;
            }

            function copyToClipboard(elementId) {
                const textToCopy = document.getElementById(elementId).textContent;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert('✅ Copied to clipboard!'))
                    .catch(err => console.error('Failed to copy text:', err));
            }

            generateCredentials();
        </script>
    </body>
    </html>`;
}