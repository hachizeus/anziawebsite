import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_FILE = path.join(__dirname, 'src', 'utils', 'icons.js');
const SRC_DIR = path.join(__dirname, 'src');

// 1. Find all JSX tags that look like <SomeIcon ...>
function findUsedIcons(dir) {
  const exts = ['.js', '.jsx', '.ts', '.tsx'];
  let icons = new Set();

  function walk(folder) {
    fs.readdirSync(folder).forEach(file => {
      const full = path.join(folder, file);
      if (fs.statSync(full).isDirectory()) return walk(full);
      if (!exts.includes(path.extname(full))) return;
      const content = fs.readFileSync(full, 'utf8');
      const regex = /<([A-Z][A-Za-z0-9]+)[\s/>]/g;
      let match;
      while ((match = regex.exec(content))) {
        icons.add(match[1]);
      }
    });
  }
  walk(dir);
  return Array.from(icons);
}

// 2. Read icons.js and find all exported icons
function getExportedIcons(content) {
  const regex = /export const ([A-Z][A-Za-z0-9]+) = createIcon/g;
  let match, icons = new Set();
  while ((match = regex.exec(content))) {
    icons.add(match[1]);
  }
  return icons;
}

// 3. Add missing exports to icons.js
function syncIcons() {
  const usedIcons = findUsedIcons(SRC_DIR);
  let iconsJs = fs.readFileSync(ICONS_FILE, 'utf8');
  const exportedIcons = getExportedIcons(iconsJs);

  // Find missing icons
  const missing = usedIcons.filter(icon => !exportedIcons.has(icon));

  if (missing.length === 0) {
    console.log('All used icons are already exported!');
    return;
  }

  // Insert new exports before the default export
  const insertPoint = iconsJs.lastIndexOf('// Default export for compatibility');
  const exportLines = missing.map(icon => `export const ${icon} = createIcon('${icon}');`).join('\n') + '\n';
  iconsJs = iconsJs.slice(0, insertPoint) + exportLines + iconsJs.slice(insertPoint);

  // Add to default export object
  const defaultExportStart = iconsJs.indexOf('export default {');
  const defaultExportEnd = iconsJs.indexOf('};', defaultExportStart);
  const before = iconsJs.slice(0, defaultExportEnd);
  const after = iconsJs.slice(defaultExportEnd);
  const newDefault = missing.map(icon => `  ${icon},`).join('\n');
  iconsJs = before + '\n' + newDefault + '\n' + after;

  fs.writeFileSync(ICONS_FILE, iconsJs, 'utf8');
  console.log(`Added missing icons: ${missing.join(', ')}`);
}

syncIcons();