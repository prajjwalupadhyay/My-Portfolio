const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tech-stack-icons.js'), 'utf8');
const jsonStr = content.replace('window.TechStackIcons = ', '').slice(0, -1);
const icons = JSON.parse(jsonStr);

const list = [
  'android', 'androidstudio', 'bootstrap', 'css3', 'css', 'figma', 'firebase',
  'gemini', 'git', 'github', 'html5', 'html', 'java', 'javascript', 'js',
  'laravel', 'mongodb', 'mysql', 'netlify', 'nextjs', 'nodejs', 'php',
  'postgresql', 'postgres', 'postman', 'prisma', 'python', 'py', 'reactjs',
  'react', 'tailwindcss', 'tailwind', 'typescript', 'ts'
];

list.forEach(k => {
  if (icons[k]) {
    console.log(`FOUND: ${k}`);
  }
});
