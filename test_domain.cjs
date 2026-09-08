const https = require('https');
const http = require('http');

const DOMAIN = 'xoaipmang.com';

function fetchUrl(url, options = {}) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Antigravity-Checker/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      },
      timeout: 10000,
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ error: 'Request Timeout (10s)' });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log(`====================================================`);
  console.log(`KIỂM TRA HỆ THỐNG DOMAIN: https://${DOMAIN}`);
  console.log(`====================================================\n`);

  // 1. Check Homepage
  console.log(`[1] Kiểm tra Trang chủ (index.html):`);
  const homeRes = await fetchUrl(`https://${DOMAIN}/`);
  if (homeRes.error) {
    console.log(`  ❌ Lỗi kết nối HTTPS: ${homeRes.error}`);
    const httpRes = await fetchUrl(`http://${DOMAIN}/`);
    if (httpRes.error) {
      console.log(`  ❌ Lỗi kết nối HTTP: ${httpRes.error}`);
    } else {
      console.log(`  ⚠️ Truy cập được qua HTTP (Status: ${httpRes.statusCode})`);
    }
  } else {
    console.log(`  ✅ HTTPS Status: ${homeRes.statusCode}`);
    console.log(`  - Title HTML: ${homeRes.body.includes('<title>') ? 'Có thẻ title' : 'Không có thẻ title'}`);
    console.log(`  - Nhận diện LLWIN: ${homeRes.body.includes('llwin') || homeRes.body.includes('LLWIN') ? 'Có' : 'Không'}`);
    console.log(`  - Server: ${homeRes.headers['server'] || 'N/A'}`);
    console.log(`  - Cloudflare Ray ID: ${homeRes.headers['cf-ray'] || 'Không có CF-Ray'}`);
  }

  // 2. Check Admin Page
  console.log(`\n[2] Kiểm tra Trang Admin (admin.html):`);
  const adminRes = await fetchUrl(`https://${DOMAIN}/admin.html`);
  if (adminRes.error) {
    console.log(`  ❌ Lỗi: ${adminRes.error}`);
  } else {
    console.log(`  ✅ Admin Status: ${adminRes.statusCode}`);
    console.log(`  - Form đăng nhập admin: ${adminRes.body.includes('admin-login-form') ? 'Có sẵn' : 'Không thấy'}`);
  }

  // 3. Check CSS & JS Assets
  console.log(`\n[3] Kiểm tra Assets (CSS / JS / SVG):`);
  const cssRes = await fetchUrl(`https://${DOMAIN}/assets/css/style.css`);
  console.log(`  - CSS style.css: ${cssRes.statusCode === 200 ? '✅ 200 OK' : '❌ Lỗi ' + (cssRes.statusCode || cssRes.error)}`);
  
  const jsDbRes = await fetchUrl(`https://${DOMAIN}/assets/js/db.js`);
  console.log(`  - JS db.js: ${jsDbRes.statusCode === 200 ? '✅ 200 OK' : '❌ Lỗi ' + (jsDbRes.statusCode || jsDbRes.error)}`);

  const jsAppRes = await fetchUrl(`https://${DOMAIN}/assets/js/app.js`);
  console.log(`  - JS app.js: ${jsAppRes.statusCode === 200 ? '✅ 200 OK' : '❌ Lỗi ' + (jsAppRes.statusCode || jsAppRes.error)}`);

  const svgRes = await fetchUrl(`https://${DOMAIN}/uploads/banner_llwin.svg`);
  console.log(`  - SVG banner_llwin.svg: ${svgRes.statusCode === 200 ? '✅ 200 OK' : '❌ Lỗi ' + (svgRes.statusCode || svgRes.error)}`);

  // 4. Check API Endpoints
  console.log(`\n[4] Kiểm tra API Backend (/api/data & api.php):`);
  
  // Try /api/data (Cloudflare Pages Function / Node Server)
  const apiDataRes = await fetchUrl(`https://${DOMAIN}/api/data`);
  console.log(`  - /api/data Status: ${apiDataRes.statusCode || apiDataRes.error}`);
  if (apiDataRes.statusCode === 200) {
    try {
      const json = JSON.parse(apiDataRes.body);
      console.log(`    ✅ Đọc API /api/data thành công!`);
      console.log(`    - Số mã code hiện có: ${json.codes ? json.codes.length : 0}`);
      console.log(`    - Số banner nhà cái: ${json.banners ? json.banners.length : 0}`);
      console.log(`    - Link LLWIN mặc định: ${json.config ? json.config.defaultHouseLink : 'N/A'}`);
    } catch (e) {
      console.log(`    ⚠️ Response không phải JSON: ${apiDataRes.body.substring(0, 100)}`);
    }
  }

  // Try api.php?action=data (PHP Hosting)
  const apiPhpRes = await fetchUrl(`https://${DOMAIN}/api.php?action=data`);
  console.log(`  - api.php?action=data Status: ${apiPhpRes.statusCode || apiPhpRes.error}`);
  if (apiPhpRes.statusCode === 200) {
    try {
      const json = JSON.parse(apiPhpRes.body);
      console.log(`    ✅ Đọc API PHP thành công!`);
      console.log(`    - Số mã code: ${json.codes ? json.codes.length : 0}`);
    } catch (e) {
      console.log(`    ⚠️ Response PHP không phải JSON`);
    }
  }

  // 5. Test Live Consume Code flow
  console.log(`\n[5] Thử nghiệm chức năng Xác thực & Dùng Mã (API Consume Code):`);
  
  const testPayload = JSON.stringify({
    code: 'LLWIN-SAFE-888',
    username: 'test_checker_user'
  });

  let consumeRes = await fetchUrl(`https://${DOMAIN}/api/codes/consume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: testPayload
  });

  if (consumeRes.statusCode !== 200 && consumeRes.statusCode !== 400) {
    // Try PHP endpoint
    consumeRes = await fetchUrl(`https://${DOMAIN}/api.php?action=consume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: testPayload
    });
  }

  console.log(`  - Test xác thực mã LLWIN-SAFE-888 Status: ${consumeRes.statusCode}`);
  console.log(`  - Phản hồi từ server: ${consumeRes.body}`);

  console.log(`\n====================================================`);
  console.log(`HOÀN TẤT KIỂM TRA!`);
  console.log(`====================================================`);
}

runTests();
