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

const META = {
    ru: {
        title: 'Алексей Сысоев — Frontend-разработчик на Vue 3 + TypeScript',
        description:
            'Frontend-разработчик с 5-летним опытом. Vue 3, TypeScript, SSR, WebSocket, Docker, CI/CD. Портфолио с живыми демо и открытым исходным кодом.',
        ogTitle: 'Алексей Сысоев — Frontend-разработчик',
        ogDescription: 'Vue 3 + TypeScript. SSR, WebSocket, Docker, CI/CD. Живые демо и открытый код.',
        locale: 'ru_RU',
    },
    en: {
        title: 'Alexey Sysoev — Frontend Developer (Vue 3 + TypeScript)',
        description:
            'Frontend developer with 5 years of experience. Vue 3, TypeScript, SSR, WebSocket, Docker, CI/CD. Portfolio with live demos and open source.',
        ogTitle: 'Alexey Sysoev — Frontend Developer',
        ogDescription: 'Vue 3 + TypeScript. SSR, WebSocket, Docker, CI/CD. Live demos and open source.',
        locale: 'en_US',
    },
};

const template = (html, state, lang = 'ru') => {
    const cssFiles = getCssFiles();
    const cssLinks = cssFiles.map((f) => `<link rel="stylesheet" href="${f}">`).join('\n        ');
    const clientFile = getClientFile();
    const meta = META[lang] ?? META.ru;

    return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="/favicon.svg">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Основное -->
        <title>${meta.title}</title>
        <meta name="description" content="${meta.description}">
        <meta name="author" content="Алексей Сысоев">
        <meta name="robots" content="index, follow">

        <!-- Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://myskilldev.ru/">
        <meta property="og:title" content="${meta.ogTitle}">
        <meta property="og:description" content="${meta.ogDescription}">
        <meta property="og:image" content="https://myskilldev.ru/og-image.png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="${meta.locale}">
        <meta property="og:site_name" content="SkillDev">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${meta.ogTitle}">
        <meta name="twitter:description" content="${meta.ogDescription}">
        <meta name="twitter:image" content="https://myskilldev.ru/og-image.png">

        <!-- Шрифты -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

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
