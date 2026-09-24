const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

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

const getCssFiles = () => {
    const cssDir = path.resolve(__dirname, 'dist/css');
    if (!fs.existsSync(cssDir)) return [];

    const files = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));

    files.sort((a, b) => {
        const aTime = fs.statSync(path.join(cssDir, a)).mtimeMs;
        const bTime = fs.statSync(path.join(cssDir, b)).mtimeMs;
        return bTime - aTime;
    });

    return files.map((f) => `/css/${f}`);
};

const getClientFile = () => {
    const distDir = path.resolve(__dirname, 'dist');
    if (!fs.existsSync(distDir)) return '/client.js';

    const files = fs
        .readdirSync(distDir)
        .filter((f) => f.startsWith('client.') && f.endsWith('.js'));

    if (!files.length) return '/client.js';

    files.sort((a, b) => {
        const aTime = fs.statSync(path.join(distDir, a)).mtimeMs;
        const bTime = fs.statSync(path.join(distDir, b)).mtimeMs;
        return bTime - aTime;
    });

    return `/${files[0]}`;
};

const template = (html, state, lang = 'ru') => {
    const cssFiles = getCssFiles();
    const cssLinks = cssFiles.map((f) => `<link rel="stylesheet" href="${f}">`).join('\n        ');
    const clientFile = getClientFile();

    return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="/favicon.svg">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SkillDev - Frontend Developer Portfolio</title>
        ${cssLinks}
    </head>
    <body>
        <div id="app">${html}</div>
        <script>window.__INITIAL_STATE__ = ${state}</script>
        <script src="${clientFile}"></script>
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

        const lang = req.cookies.portfolioLang === 'en' ? 'en' : 'ru';

        try {
            const { html, state } = await renderer('/', lang);
            res.send(template(html, state, lang));
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
