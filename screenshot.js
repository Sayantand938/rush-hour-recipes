import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// Get URL from command line or use default (your dev server)
const url = process.argv[2] || 'http://localhost:5173';

// Define viewports to test
const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 800 },
    { name: 'Wide', width: 1920, height: 1080 },
];

// Output directory for screenshots
const OUTPUT_DIR = './screenshots';

// 👇 Path to Brave browser (update if your path is different)
const BRAVE_PATH =
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

async function takeScreenshots() {
    console.log(`🌐 Opening: ${url}\n`);

    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Launch Brave instead of Chrome
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: BRAVE_PATH, // 👈 use Brave
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        for (const viewport of viewports) {
            const page = await browser.newPage();
            await page.setViewport({
                width: viewport.width,
                height: viewport.height,
                deviceScaleFactor: 1,
            });

            console.log(`📱 ${viewport.name} (${viewport.width}×${viewport.height})`);

            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000,
            });

            const filename = `screenshot-${viewport.name.toLowerCase()}.png`;
            const filepath = path.join(OUTPUT_DIR, filename);
            await page.screenshot({
                path: filepath,
                fullPage: true,
                type: 'png',
            });

            const metadata = await sharp(filepath).metadata();
            console.log(`   ✅ Saved: ${filename} (${metadata.width}×${metadata.height})`);

            await page.close();
        }

        console.log(`\n✅ All screenshots saved in "${OUTPUT_DIR}/"`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

takeScreenshots();