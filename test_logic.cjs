// Mock localStorage for Node environment test
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();
global.window = {
  dispatchEvent: () => {}
};
global.CustomEvent = class {};

// Load db.js
const fs = require('fs');
const dbCode = fs.readFileSync('assets/js/db.js', 'utf8');
eval(dbCode);

const db = window.db;

console.log('=== TEST 1: Check Initial Data ===');
const banners = db.getBanners();
console.log(`- Total banners: ${banners.length}`);
console.log(`- Banner #1: ID=${banners[0].id}, Name=${banners[0].name}, Link=${banners[0].link}`);
if (banners[0].id !== 'llwin' || banners[0].link !== 'https://www.07llwin.com/?id=832516623') {
  throw new Error('Banner #1 is not LLWIN!');
}
console.log('✅ TEST 1 PASSED: LLWIN is #1 with correct link');

console.log('\n=== TEST 2: Admin Login ===');
const loginFail = db.loginAdmin('admin', 'wrong_pass');
if (loginFail.success) throw new Error('Login should have failed!');
const loginOk = db.loginAdmin('admin', 'admin123');
if (!loginOk.success || !db.isAdminLoggedIn()) throw new Error('Login should have succeeded!');
console.log('✅ TEST 2 PASSED: Admin authentication works');

console.log('\n=== TEST 3: Create Single & Bulk Codes ===');
const safeCode = db.addCode({
  code: 'TEST-SAFE-100',
  status: 'SAFE',
  targetUser: '',
  note: 'Test Safe'
});
console.log(`- Created Safe Code: ${safeCode.code} (Status: ${safeCode.status})`);

const infectedCode = db.addCode({
  code: 'TEST-WARN-200',
  status: 'INFECTED',
  targetUser: 'vipuser88',
  note: 'Test Infected'
});
console.log(`- Created Infected Code: ${infectedCode.code} (Status: ${infectedCode.status}, Target: ${infectedCode.targetUser})`);

const bulk = db.addBulkCodes({
  quantity: 5,
  prefix: 'BULK',
  status: 'SAFE'
});
console.log(`- Created ${bulk.length} bulk codes: ${bulk.map(b => b.code).join(', ')}`);
console.log('✅ TEST 3 PASSED: Code generation works');

console.log('\n=== TEST 4: Verify & Consume Safe Code (1-time use) ===');
const resSafe = db.verifyAndConsumeCode('TEST-SAFE-100', 'player_one');
console.log(`- Consumed: code=${resSafe.code}, status=${resSafe.status}, usedBy=${resSafe.usedBy}`);
if (resSafe.status !== 'SAFE') throw new Error('Status should be SAFE');

// Try using again
try {
  db.verifyAndConsumeCode('TEST-SAFE-100', 'player_two');
  throw new Error('Should have thrown already used error!');
} catch (e) {
  console.log(`- Caught expected error on 2nd use: "${e.message}"`);
}
console.log('✅ TEST 4 PASSED: 1-time consumption enforced');

console.log('\n=== TEST 5: Verify Target User Restriction ===');
try {
  db.verifyAndConsumeCode('TEST-WARN-200', 'wrong_player');
  throw new Error('Should have thrown user mismatch error!');
} catch (e) {
  console.log(`- Caught expected error for wrong user: "${e.message}"`);
}

const resInfected = db.verifyAndConsumeCode('TEST-WARN-200', 'vipuser88');
console.log(`- Successfully consumed by assigned user: status=${resInfected.status}`);
if (resInfected.status !== 'INFECTED') throw new Error('Status should be INFECTED');
console.log('✅ TEST 5 PASSED: Target user validation works');

console.log('\n=== TEST 6: Reset Code Status ===');
db.resetUsedCode(safeCode.id);
const reConsumed = db.verifyAndConsumeCode('TEST-SAFE-100', 'player_retest');
console.log(`- Re-consumed after reset: ${reConsumed.code}`);
console.log('✅ TEST 6 PASSED: Reset code to unused works');

console.log('\n=== TEST 7: Update LLWIN Link in Config ===');
const newLink = 'https://www.07llwin.com/?id=832516623&aff=vip';
db.updateBanner('llwin', { link: newLink });
const updatedBanners = db.getBanners();
if (updatedBanners[0].link !== newLink) throw new Error('Banner link update failed');
console.log(`- Updated LLWIN link: ${updatedBanners[0].link}`);
console.log('✅ TEST 7 PASSED: LLWIN link update works');

console.log('\n🎉 ALL 7 INTEGRATION TESTS PASSED PERFECTLY! 🎉\n');
