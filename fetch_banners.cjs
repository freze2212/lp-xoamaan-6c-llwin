const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  try {
    const data = await fetchJson('https://api.xoamanhacai.com/api/banners');
    console.log('Banners response:', JSON.stringify(data, null, 2));
    fs.writeFileSync('banners.json', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching banners:', err.message);
  }
}

main();
