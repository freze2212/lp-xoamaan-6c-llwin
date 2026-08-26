const http = require('http');

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, statusCode: res.statusCode, length: data.length, contentType: res.headers['content-type'] });
      });
    }).on('error', reject);
  });
}

async function testAll() {
  const urls = [
    'http://localhost:3000/index.html',
    'http://localhost:3000/admin.html',
    'http://localhost:3000/assets/css/style.css',
    'http://localhost:3000/assets/js/db.js',
    'http://localhost:3000/assets/js/app.js',
    'http://localhost:3000/assets/js/admin.js',
    'http://localhost:3000/uploads/banner_llwin.svg',
    'http://localhost:3000/uploads/banner_1773924084584_dded26c768daf8.png'
  ];

  for (const u of urls) {
    try {
      const res = await checkUrl(u);
      console.log(`[${res.statusCode}] ${res.url} (${res.length} bytes, ${res.contentType})`);
    } catch (e) {
      console.error(`FAILED ${u}:`, e.message);
    }
  }
}

testAll();
