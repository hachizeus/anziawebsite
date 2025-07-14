import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_FILE = path.join(__dirname, 'src', 'utils', 'icons.js');
const SRC_DIR = path.join(__dirname, 'src');

// Patterns for icon-like names (add more if needed)
const iconPattern = /(Icon|Head|Chart|Copy|Dollar|Compass|Github|Linkedin|Eye|Bar|Arrow|Circle|Check|Plus|Minus|Star|Heart|Bell|Mail|User|Lock|Tag|Trash|Camera|Map|Pin|Home|Menu|List|Edit|Save|Upload|Download|Share|Search|Settings|Shield|Video|X|Chevron|Calendar|Book|Message|Phone|Credit|Package|Paperclip|Pencil|Shopping|Sliders|Sparkles|Thumbs|Zoom|Youtube|Facebook|Instagram|Twitter|Headphones)$/;

// List of known HTML/SVG tags to skip
const skipList = new Set([
  'circle','head','textarea','thead','svg','span','div','form','input','button','img','path','rect','g','line','polyline','polygon','ellipse','tbody','tr','td','th','ul','li','ol','a','p','h1','h2','h3','h4','h5','h6','section','article','aside','footer','header','nav','main','figure','figcaption','label','select','option','iframe','meta','script','style','title','body','html'
]);

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
        const name = match[1];
        if (iconPattern.test(name) && !skipList.has(name)) {
          icons.add(name);
        }
      }
    });
  }
  walk(dir);
  return Array.from(icons);
}

function getExportedIcons(content) {
  const regex = /export const ([A-Z][A-Za-z0-9]+) = createIcon/g;
  let match, icons = new Set();
  while ((match = regex.exec(content))) {
    icons.add(match[1]);
  }
  return icons;
}

function syncIcons() {
  const usedIcons = findUsedIcons(SRC_DIR);
  let iconsJs = fs.readFileSync(ICONS_FILE, 'utf8');
  const exportedIcons = getExportedIcons(iconsJs);

  // Find missing icons
  const missing = usedIcons.filter(icon => !exportedIcons.has(icon));

  if (missing.length === 0) {
    console.log('All icon-like components are already exported!');
    return;
  }

  // Insert new exports before the default export or at the end if not found
  let insertPoint = iconsJs.lastIndexOf('// Default export for compatibility');
  if (insertPoint === -1) insertPoint = iconsJs.length;
  const exportLines = missing.map(icon => `export const ${icon} = createIcon('${icon}');`).join('\n') + '\n';
  iconsJs = iconsJs.slice(0, insertPoint) + exportLines + iconsJs.slice(insertPoint);

  // Add to default export object if it exists
  const defaultExportStart = iconsJs.indexOf('export default {');
  if (defaultExportStart !== -1) {
    const defaultExportEnd = iconsJs.indexOf('};', defaultExportStart);
    const before = iconsJs.slice(0, defaultExportEnd);
    const after = iconsJs.slice(defaultExportEnd);
    const newDefault = missing.map(icon => `  ${icon},`).join('\n');
    iconsJs = before + '\n' + newDefault + '\n' + after;
  }

  fs.writeFileSync(ICONS_FILE, iconsJs, 'utf8');
  console.log(`Added missing icon-like components: ${missing.join(', ')}`);
}

syncIcons();