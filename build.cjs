const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const chunks = fs.readdirSync('.').filter(n => /^site\.b64\.\d+$/.test(n)).sort();
if (!chunks.length) throw new Error('G2 site payload not found');
const encoded = chunks.map(n => fs.readFileSync(n, 'utf8').trim()).join('');
const archive = '/tmp/g2-site.tar.gz';
fs.writeFileSync(archive, Buffer.from(encoded, 'base64'));
fs.rmSync('public', { recursive: true, force: true });
fs.mkdirSync('public', { recursive: true });
const x = spawnSync('tar', ['-xzf', archive, '-C', 'public'], { stdio: 'inherit' });
if (x.status !== 0) throw new Error('Could not extract G2 dashboard payload');
const logo = path.join('public','assets','g2_logo.png');
const ocean = path.join('public','assets','g2_ocean_logo.png');
if (fs.existsSync(logo) && !fs.existsSync(ocean)) fs.copyFileSync(logo, ocean);
console.log('G2 Port Operations Dashboard V3.13.1 ready in public/');
