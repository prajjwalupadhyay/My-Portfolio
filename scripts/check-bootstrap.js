const fs = require('fs');
const content = fs.readFileSync('assets/js/tech-stack-icons.js', 'utf8');
const jsonStr = content.replace('window.TechStackIcons = ', '').slice(0, -1);
const icons = JSON.parse(jsonStr);
console.log(Object.keys(icons).filter(k => k.includes('boot')));
