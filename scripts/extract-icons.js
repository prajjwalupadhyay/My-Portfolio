const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'node_modules', 'tech-stack-icons', 'dist', 'index.js');
const content = fs.readFileSync(distPath, 'utf8');

const iconMap = {};
const regex = /(?:["']?([a-zA-Z0-9_$]+)["']?):\{svg:\{light:'([^']+)'/g;
let match;
while ((match = regex.exec(content)) !== null) {
  iconMap[match[1]] = match[2];
}

console.log(`Extracted ${Object.keys(iconMap).length} icons from tech-stack-icons.`);

const outputPath = path.join(__dirname, '..', 'assets', 'js', 'tech-stack-icons.js');
const fileContent = `window.TechStackIcons = ${JSON.stringify(iconMap)};`;
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Saved to ${outputPath}`);
