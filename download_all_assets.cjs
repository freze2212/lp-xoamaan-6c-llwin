const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const bannersData = JSON.parse(fs.readFileSync('banners.json', 'utf8'));

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
      }
    });
    req.on('error', err => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(dest, () => {});
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
};

async function downloadAll() {
  // Download video background
  try {
    console.log('Downloading video background...');
    await downloadFile('https://xoamanhacai.com/assets/video_background.mp4', 'public/assets/video_background.mp4');
    console.log('Downloaded video background.');
  } catch (e) {
    console.error('Video background download failed:', e.message);
  }

  for (const b of bannersData.banners) {
    const fullUrl = 'https://api.xoamanhacai.com' + b.imageUrl;
    const localPath = path.join('public', b.imageUrl);
    try {
      console.log(`Downloading banner ${b.id}: ${fullUrl}`);
      await downloadFile(fullUrl, localPath);
      console.log(`Downloaded ${b.id}`);
    } catch (e) {
      console.error(`Failed ${b.id}:`, e.message);
    }
  }
  console.log('All downloads finished!');
}

downloadAll();
