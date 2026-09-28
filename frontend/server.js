const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const app = express();
app.use(cookieParser());
app.use(compression());

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
    const distDir = path.resolve(__dirname, 'dist/js');
    if (!fs.existsSync(distDir)) return '/js/client.js';

    const files = fs
        .readdirSync(distDir)
        .filter((f) => f.startsWith('client.') && f.endsWith('.js'));

    if (!files.length) return '/js/client.js';

    files.sort((a, b) => {
        const aTime = fs.statSync(path.join(distDir, a)).mtimeMs;
        const bTime = fs.statSync(path.join(distDir, b)).mtimeMs;
        return bTime - aTime;
    });

    return `/js/${files[0]}`;
};

const META = {
    ru: {
        title: 'Алексей Сысоев — Frontend-разработчик на Vue 3 + TypeScript',
        description:
            'Frontend-разработчик с 5-летним опытом. Vue 3, TypeScript, SSR, WebSocket, Docker, CI/CD. Портфолио с живыми демо и открытым исходным кодом.',
        ogTitle: 'Алексей Сысоев — Frontend-разработчик',
        ogDescription:
            'Vue 3 + TypeScript. SSR, WebSocket, Docker, CI/CD. Живые демо и открытый код.',
        locale: 'ru_RU',
    },
    en: {
        title: 'Alexey Sysoev — Frontend Developer (Vue 3 + TypeScript)',
        description:
            'Frontend developer with 5 years of experience. Vue 3, TypeScript, SSR, WebSocket, Docker, CI/CD. Portfolio with live demos and open source.',
        ogTitle: 'Alexey Sysoev — Frontend Developer',
        ogDescription:
            'Vue 3 + TypeScript. SSR, WebSocket, Docker, CI/CD. Live demos and open source.',
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

        <!-- Шрифты (локальные) -->
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-v20-cyrillic_latin-regular.woff2" crossorigin>
        <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-v20-cyrillic_latin-600.woff2" crossorigin>
        <link rel="stylesheet" href="/fonts/fonts.css">

        <!-- Preload для LCP-картинки -->
        <link rel="preload" as="image" href="/myfoto-350.webp" type="image/webp" imagesrcset="/myfoto-350.webp 350w, /myfoto-650.webp 650w" imagesizes="(min-width: 1024px) 350px, (min-width: 768px) 280px, 220px">

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
        app.use('/css', express.static(cssPath, { maxAge: '1y', immutable: true }));
    }

    const jsPath = path.resolve(__dirname, 'dist/js');
    if (fs.existsSync(jsPath)) {
        app.use('/js', express.static(jsPath, { maxAge: '1y', immutable: true }));
    }

    const fontsPath = path.resolve(__dirname, 'dist/fonts');
    if (fs.existsSync(fontsPath)) {
        app.use('/fonts', express.static(fontsPath, { maxAge: '1y', immutable: true }));
    }

    app.use(
        express.static(path.resolve(__dirname, 'dist'), {
            maxAge: '1d',
            index: false,
            setHeaders: (res, filepath) => {
                if (filepath.endsWith('.html')) {
                    res.setHeader('Cache-Control', 'no-cache');
                }
            },
        })
    );

    app.use((req, res) => {
        const indexHtml = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8');
        res.send(indexHtml);
    });

    app.listen(PORT, () => {
        console.log(`SSR Server running on http://localhost:${PORT}`);
    });
});
