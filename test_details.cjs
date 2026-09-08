const https = require('https');

function getUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          location: res.headers['location'],
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function checkDetails() {
  console.log('--- Kiểm tra Redirect của /admin.html ---');
  const r1 = await getUrl('https://xoaipmang.com/admin.html');
  console.log('GET /admin.html => Status:', r1.statusCode, 'Location:', r1.location);

  const r2 = await getUrl('https://xoaipmang.com/admin');
  console.log('GET /admin => Status:', r2.statusCode, 'Content preview:', r2.body.substring(0, 150));

  console.log('\n--- Kiểm tra Functions/Worker ---');
  const r3 = await getUrl('https://xoaipmang.com/functions/api/[[route]].js');
  console.log('GET /functions/api/[[route]].js => Status:', r3.statusCode);
  if (r3.statusCode === 200) {
    console.log('⚠️ Phát hiện: Bạn đang deploy theo kiểu Upload File Tĩnh / Direct Upload (kéo thả zip), Cloudflare không chạy thư mục functions thành Backend API!');
  }
}

checkDetails();
