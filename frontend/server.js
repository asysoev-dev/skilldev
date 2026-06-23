const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.SSR_PORT || 3000;

let renderer;

async function loadRenderer() {
    const serverPath = path.resolve(__dirname, 'dist-server/entry-server.js');

    if (!fs.existsSync(serverPath)) {
        console.error('File not found:', serverPath);
        return;
    }

    try {
        const serverEntry = require(serverPath);
        renderer = serverEntry.render;
    } catch (err) {
        console.error('Error loading server entry:', err.message);
    }
}

const getCssFile = () => {
    const cssDir = path.resolve(__dirname, 'dist/css');
    if (!fs.existsSync(cssDir)) return '/css/main.css';

    const files = fs.readdirSync(cssDir);
    const mainCss = files.find((f) => f.startsWith('main.') && f.endsWith('.css'));
    return mainCss ? `/css/${mainCss}` : '/css/main.css';
};

const template = (html, state) => {
    const cssPath = getCssFile();
    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="/favicon.ico">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SkillDev - Frontend Developer Portfolio</title>
        <link rel="stylesheet" href="${cssPath}">
    </head>
    <body>
        <div id="app">${html}</div>
        <script>window.__INITIAL_STATE__ = ${state}</script>
        <script src="/client.js"></script>
    </body>
    </html>
    `;
};

loadRenderer().then(() => {
    app.get('/', async (req, res) => {
        if (!renderer) {
            const indexHtml = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8');
            res.send(indexHtml);
            return;
        }

        try {
            const { html, state } = await renderer('/');
            res.send(template(html, state));
        } catch (error) {
            console.error('Render error:', error.message);
            res.status(500).send('Server Error');
        }
    });

    const cssPath = path.resolve(__dirname, 'dist/css');
    if (fs.existsSync(cssPath)) {
        app.use('/css', express.static(cssPath));
    }

    app.use(express.static(path.resolve(__dirname, 'dist')));

    app.use((req, res) => {
        const indexHtml = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8');
        res.send(indexHtml);
    });

    app.listen(PORT, () => {
        console.log(`SSR Server running on http://localhost:${PORT}`);
    });
});
