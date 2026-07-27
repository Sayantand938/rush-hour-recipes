import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const SVG_CONTENT = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 12h20"/>
  <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
  <path d="m4 8 16-4"/>
  <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
</svg>
`;

// You can also read from file:
// const SVG_CONTENT = await fs.readFile('./public/logo.svg', 'utf-8');

async function generateIcons() {
    const outputDir = path.join(process.cwd(), 'public/icons');
    await fs.mkdir(outputDir, { recursive: true });

    // Background color for the icon (transparent or a solid colour)
    // If you want a circular background, add a circle behind the SVG.
    const sizes = [192, 512];

    for (const size of sizes) {
        const filename = `icon-${size}x${size}.png`;
        const filepath = path.join(outputDir, filename);

        // Render the SVG as a PNG
        await sharp(Buffer.from(SVG_CONTENT))
            .resize(size, size, {
                fit: 'contain',
                background: { r: 10, g: 10, b: 10, alpha: 1 }, // dark background – change to match your theme
            })
            .png()
            .toFile(filepath);

        console.log(`✅ Generated: ${filename}`);
    }
}

generateIcons().catch(console.error);