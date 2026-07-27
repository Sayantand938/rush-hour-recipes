import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RECIPES_DIR = path.join(__dirname, '../public/recipes');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'manifest.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Check if recipes directory exists, if not, create empty manifest and exit
if (!fs.existsSync(RECIPES_DIR)) {
    fs.mkdirSync(RECIPES_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    console.log('📁 Created public/recipes. Add your .md files and run again.');
    process.exit(0);
}

// Read all .md files
const files = fs.readdirSync(RECIPES_DIR).filter((f) => f.endsWith('.md'));

const manifest = files.map((filename) => {
    const filePath = path.join(RECIPES_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    // Slug = filename without extension
    const slug = filename.replace(/\.md$/, '');

    return {
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        time: data.time || 30,
        tags: data.tags || [],
        image: data.image || null,
        description: data.description || '',
    };
});

// Sort by title or time (optional)
manifest.sort((a, b) => a.title.localeCompare(b.title));

// Write manifest
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

console.log(`✅ Manifest generated with ${manifest.length} recipes.`);