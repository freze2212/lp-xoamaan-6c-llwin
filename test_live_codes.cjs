const https = require('https');

function postApi(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request('https://xoaipmang.com' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: d });
        }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(data);
    req.end();
  });
}

function getApi(path) {
  return new Promise((resolve) => {
    https.get('https://xoaipmang.com' + path, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: d });
        }
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function fullTest() {
  console.log('================================================================');
  console.log('BẮT ĐẦU TEST CURL THỰC TẾ TRÊN DOMAIN https://xoaipmang.com');
  console.log('================================================================\n');

  // Test 1: Đọc DB hiện tại
  console.log('1. [GET /api/data] - Đọc danh sách mã hiện tại:');
  const getRes = await getApi('/api/data');
  console.log('   Status:', getRes.status);
  console.log('   Số mã hiện có trên server:', getRes.data?.codes?.length);
  console.log('   Chi tiết các mã:', JSON.stringify(getRes.data?.codes?.map(c => ({ code: c.code, status: c.status, isUsed: c.isUsed })), null, 2));

  // Test 2: Tạo mã mới qua API
  const testNewCode = 'TEST-VIP-' + Math.floor(Math.random() * 8999 + 1000);
  console.log('\n2. [POST /api/codes/add] - Admin cấp mã mới: ' + testNewCode);
  const addRes = await postApi('/api/codes/add', {
    code: testNewCode,
    status: 'SAFE',
    targetUser: '',
    note: 'Mã test tự động bằng curl'
  });
  console.log('   Status:', addRes.status);
  console.log('   Kết quả thêm mã:', addRes.data?.success ? '✅ THÀNH CÔNG!' : addRes.data);

  // Test 3: Khách hàng nhập mã vừa tạo
  console.log('\n3. [POST /api/codes/consume] - Khách tài khoản "nhanvien_test" nhập mã ' + testNewCode + ':');
  const consumeRes = await postApi('/api/codes/consume', {
    code: testNewCode,
    username: 'nhanvien_test'
  });
  console.log('   Status:', consumeRes.status);
  console.log('   Kết quả quét mã:', JSON.stringify(consumeRes.data, null, 2));

  // Test 4: Khách khác cố tình dùng lại mã đó
  console.log('\n4. [POST /api/codes/consume] - Khách khác ("hacker_fake") cố dùng lại mã ' + testNewCode + ':');
  const reuseRes = await postApi('/api/codes/consume', {
    code: testNewCode,
    username: 'hacker_fake'
  });
  console.log('   Status:', reuseRes.status);
  console.log('   Phản hồi chặn từ hệ thống:', JSON.stringify(reuseRes.data, null, 2));

  // Test 5: Nhập mã rác không tồn tại
  console.log('\n5. [POST /api/codes/consume] - Nhập mã rác "MA-KHONG-TON-TAI":');
  const invalidRes = await postApi('/api/codes/consume', {
    code: 'MA-KHONG-TON-TAI',
    username: 'khach_la'
  });
  console.log('   Status:', invalidRes.status);
  console.log('   Phản hồi từ hệ thống:', JSON.stringify(invalidRes.data, null, 2));

  console.log('\n================================================================');
  console.log('HOÀN TẤT TEST CURL TOÀN BỘ CHỨC NĂNG!');
  console.log('================================================================');
}

fullTest();
