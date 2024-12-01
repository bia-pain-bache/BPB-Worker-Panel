export async function renderLoginPage () {
    const loginPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <style>
        :root {
            --color: black;
            --primary-color: #09639f;
            --header-color: #09639f; 
            --background-color: #fff;
            --form-background-color: #f9f9f9;
            --lable-text-color: #333;
            --h2-color: #3b3b3b;
            --border-color: #ddd;
            --input-background-color: white;
            --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: var(--background-color);
            position: relative;
            overflow: hidden;
        }
        body.dark-mode {
            --color: white;
            --primary-color: #09639F;
            --header-color: #3498DB; 
            --background-color: #121212;
            --form-background-color: #121212;
            --lable-text-color: #DFDFDF;
            --h2-color: #D5D5D5;
            --border-color: #353535;
            --input-background-color: #252525;
            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        
        h2 { text-align: center; color: var(--h2-color) }
        .form-container {
            background: var(--form-background-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .form-control { margin-bottom: 15px; display: flex; align-items: center; }
        label {
            display: block;
            margin-bottom: 5px;
            padding-right: 20px;
            font-size: 110%;
            font-weight: 600;
            color: var(--lable-text-color);
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            color: var(--lable-text-color);
            background-color: var(--input-background-color);
        }
        button {
            display: block;
            width: 100%;
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
        .button:hover,
        button:focus {
            background-color: #2980b9;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        button.button:hover { color: white; }
        .button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
        @media only screen and (min-width: 768px) {
            .container { width: 30%; }
        }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>BPB Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> 💦</h1>
            <div class="form-container">
                <h2>User Login</h2>
                <form id="loginForm">
                    <div class="form-control">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>
                    <button type="submit" class="button">Login</button>
                </form>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
        document.getElementById('loginForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: password
                });
            
                if (!response.ok) {
                    passwordError.textContent = '⚠️ Wrong Password!';
                    const errorMessage = await response.text();
                    console.error('Login failed:', errorMessage);
                    return;
                }
                window.location.href = '/panel';
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    </script>
    </body>
    </html>`;

    return new Response(loginPage, {
        status: 200,
        headers: {
            'Content-Type': 'text/html;charset=utf-8',
            'Access-Control-Allow-Origin': globalThis.urlOrigin,
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, no-transform',
            'CDN-Cache-Control': 'no-store'
        }
    });
}