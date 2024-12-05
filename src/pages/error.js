export async function renderErrorPage (error) {
    const errorPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Page</title>
        <style>
            :root {
                --color: black;
                --header-color: #09639f; 
                --background-color: #fff;
                --border-color: #ddd;
                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            }
            body, html {
                height: 100%;
                width: 100%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: system-ui;
                color: var(--color);
                background-color: var(--background-color);
            }
            body.dark-mode {
                --color: white;
                --header-color: #3498DB; 
                --background-color: #121212;
                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);          
            }
            h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }
            #error-container { text-align: center; }
        </style>
    </head>
    <body>
        <div id="error-container">
            <h1>BPB Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> 💦</h1>
            <div id="error-message">
                <h2>❌ Something went wrong!</h2>
                <p><b>${error ? `⚠️ ${error.cause ? error.message.toString() : error.stack.toString()}` : ''}</b></p>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
    </script>
    </body>
    </html>`;

    return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
}