/**
 * Local Database Management for Tool Xoá Mã Nhà Cái
 * Uses localStorage with real-time sync capabilities
 */

const DB_KEYS = {
  CODES: 'xoa_ma_codes',
  BANNERS: 'xoa_ma_banners',
  ADMIN_AUTH: 'xoa_ma_admin_auth',
  ADMIN_CREDS: 'xoa_ma_admin_creds',
  APP_CONFIG: 'xoa_ma_config'
};

// Initial Banners Data with LLWIN at #1
const INITIAL_BANNERS = [
  {
    id: 'llwin',
    name: 'LLwin',
    imageUrl: './uploads/banner_llwin.svg',
    link: 'https://www.07llwin.com/?id=832516623',
    locked: false,
    isHot: true,
    sortOrder: 1,
    description: 'Trang chủ nhà cái LLwin chính thức'
  },
  { id: '1', name: 'Nhà cái #1', imageUrl: './uploads/banner_1773924084584_dded26c768daf8.png', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 2 },
  { id: '2', name: 'Nhà cái #2', imageUrl: './uploads/banner_1773906314787_f3e8171ec5347.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 3 },
  { id: '3', name: 'Nhà cái #3', imageUrl: './uploads/banner_1773906318979_ccb97ad68e11b8.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 4 },
  { id: '4', name: 'Nhà cái #4', imageUrl: './uploads/banner_1773906324232_93aa07f91227a8.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 5 },
  { id: '5', name: 'Nhà cái #5', imageUrl: './uploads/banner_1773906332137_0b4fd85fb41e58.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 6 },
  { id: '6', name: 'Nhà cái #6', imageUrl: './uploads/banner_1773906339139_eb13fcf760af58.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 7 },
  { id: '7', name: 'Nhà cái #7', imageUrl: './uploads/banner_1773906358105_28851b626d8ec.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 8 },
  { id: '8', name: 'Nhà cái #8', imageUrl: './uploads/banner_1773906362659_71c2f0848b2228.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 9 },
  { id: '9', name: 'Nhà cái #9', imageUrl: './uploads/banner_1773906367573_5ef63401a66398.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 10 },
  { id: '10', name: 'Nhà cái #10', imageUrl: './uploads/banner_1773906372145_61fe1823cd6e98.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 11 },
  { id: '11', name: 'Nhà cái #11', imageUrl: './uploads/banner_1773906376446_4f2e92ce92e17.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 12 },
  { id: '12', name: 'Nhà cái #12', imageUrl: './uploads/banner_1773906381933_31871f2d6143.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 13 },
  { id: '13', name: 'Nhà cái #13', imageUrl: './uploads/banner_1773906390099_1a15a41d957878.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 14 },
  { id: '14', name: 'Nhà cái #14', imageUrl: './uploads/banner_1773906394528_37edc35a3a517.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 15 },
  { id: '15', name: 'Nhà cái #15', imageUrl: './uploads/banner_1773906399832_911653aa1cfe28.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 16 },
  { id: '16', name: 'Nhà cái #16', imageUrl: './uploads/banner_1773924094727_4592176cbb5d08.png', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 17 },
  { id: '17', name: 'Nhà cái #17', imageUrl: './uploads/banner_1776080887386_2e9aa3bee15fe.png', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 18 },
  { id: '18', name: 'Nhà cái #18', imageUrl: './uploads/banner_1776080923155_6079d0bfb603d.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 19 },
  { id: '19', name: 'Nhà cái #19', imageUrl: './uploads/banner_1776081025615_058179e62818c8.png', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 20 },
  { id: '20', name: 'Nhà cái #20', imageUrl: './uploads/banner_1776081187310_2f343203c75cf.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 21 }
];

// Initial preloaded codes
const INITIAL_CODES = [
  {
    id: 'code-1',
    code: 'LLWIN-SAFE-888',
    status: 'SAFE', // 'SAFE' (Mã an toàn) or 'INFECTED' (Dính mã ẩn)
    targetUser: '', // empty means any user
    isUsed: false,
    usedAt: null,
    usedBy: null,
    createdAt: new Date().toISOString(),
    note: 'Mã an toàn mặc định VIP'
  },
  {
    id: 'code-2',
    code: 'LLWIN-WARN-999',
    status: 'INFECTED',
    targetUser: '',
    isUsed: false,
    usedAt: null,
    usedBy: null,
    createdAt: new Date().toISOString(),
    note: 'Mã dính mã ẩn test'
  }
];

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

const DEFAULT_CONFIG = {
  defaultHouseLink: 'https://www.07llwin.com/?id=832516623',
  supportTelegram: 'https://t.me/thosantp79',
  siteTitle: '[ TOOL XOÁ MÃ ẨN ]'
};

class LocalDB {
  constructor() {
    this.init();
    this.fetchFromServer();
    this.startPeriodicSync();
  }

  init() {
    if (!localStorage.getItem(DB_KEYS.BANNERS)) {
      localStorage.setItem(DB_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
    }
    if (!localStorage.getItem(DB_KEYS.CODES)) {
      localStorage.setItem(DB_KEYS.CODES, JSON.stringify(INITIAL_CODES));
    }
    if (!localStorage.getItem(DB_KEYS.ADMIN_CREDS)) {
      localStorage.setItem(DB_KEYS.ADMIN_CREDS, JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem(DB_KEYS.APP_CONFIG)) {
      localStorage.setItem(DB_KEYS.APP_CONFIG, JSON.stringify(DEFAULT_CONFIG));
    }
  }

  async requestApi(endpoint, method = 'GET', body = null) {
    const config = this.getConfig();
    const candidates = [];

    if (config.cloudApiUrl && config.cloudApiUrl.startsWith('http')) {
      candidates.push(config.cloudApiUrl + (endpoint.startsWith('/') ? endpoint : '/' + endpoint));
    }

    if (endpoint === '/data') {
      candidates.push('/api/data', './api.php?action=data', 'api.php?action=data');
    } else if (endpoint === '/codes/consume') {
      candidates.push('/api/codes/consume', './api.php?action=consume', 'api.php?action=consume');
    } else if (endpoint === '/sync') {
      candidates.push('/api/sync', './api.php?action=sync', 'api.php?action=sync');
    } else {
      candidates.push('/api' + endpoint, './api.php?action=' + endpoint.replace(/^\//, ''), 'api.php?action=' + endpoint.replace(/^\//, ''));
    }

    for (const url of candidates) {
      try {
        const opts = {
          method,
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          ...(body ? { body: JSON.stringify(body) } : {})
        };
        const res = await fetch(url, opts);
        if (res.ok) {
          const json = await res.json();
          return json;
        } else if (res.status === 400 || res.status === 403 || res.status === 404) {
          const errJson = await res.json().catch(() => null);
          if (errJson && errJson.message) {
            throw new Error(errJson.message);
          }
        }
      } catch (err) {
        if (err.message && (err.message.includes('đã được sử dụng') || err.message.includes('không hợp lệ') || err.message.includes('không có quyền'))) {
          throw err;
        }
        // Try next candidate
      }
    }
    return null;
  }

  async fetchFromServer() {
    try {
      const json = await this.requestApi('/data', 'GET');
      if (json && json.success) {
        if (Array.isArray(json.codes)) {
          localStorage.setItem(DB_KEYS.CODES, JSON.stringify(json.codes));
        }
        if (Array.isArray(json.banners)) {
          localStorage.setItem(DB_KEYS.BANNERS, JSON.stringify(json.banners));
        }
        if (json.config) {
          localStorage.setItem(DB_KEYS.APP_CONFIG, JSON.stringify(json.config));
        }
        if (json.adminCreds) {
          localStorage.setItem(DB_KEYS.ADMIN_CREDS, JSON.stringify(json.adminCreds));
        }
        this.notifyUpdate();
      }
    } catch (e) {
      // Fallback to local
    }
  }

  startPeriodicSync() {
    setInterval(() => {
      this.fetchFromServer();
    }, 2500);
  }

  async pushToServer(type = 'sync', payload = {}) {
    try {
      const data = {
        codes: this.getCodes(),
        banners: this.getBanners(),
        config: this.getConfig(),
        adminCreds: this.getAdminCreds(),
        ...payload
      };
      await this.requestApi('/sync', 'POST', data);
    } catch (e) {
      // Fallback
    }
  }

  // --- CODES CRUD ---
  getCodes() {
    try {
      const data = localStorage.getItem(DB_KEYS.CODES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parsing codes:', e);
      return [];
    }
  }

  saveCodes(codes) {
    localStorage.setItem(DB_KEYS.CODES, JSON.stringify(codes));
    this.notifyUpdate();
    this.pushToServer('sync');
  }

  addCode({ code, status = 'SAFE', targetUser = '', note = '' }) {
    const codes = this.getCodes();
    const cleanCode = code.trim().toUpperCase();

    // Check duplicate
    if (codes.some(c => c.code === cleanCode)) {
      throw new Error(`Mã "${cleanCode}" đã tồn tại trong hệ thống!`);
    }

    const newEntry = {
      id: 'code_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      code: cleanCode,
      status: status === 'INFECTED' ? 'INFECTED' : 'SAFE',
      targetUser: targetUser.trim(),
      isUsed: false,
      usedAt: null,
      usedBy: null,
      createdAt: new Date().toISOString(),
      note: note.trim()
    };

    codes.unshift(newEntry);
    this.saveCodes(codes);
    return newEntry;
  }

  addBulkCodes({ quantity = 5, prefix = 'VIP', status = 'SAFE', note = '' }) {
    const codes = this.getCodes();
    const createdList = [];
    
    for (let i = 0; i < quantity; i++) {
      const randStr = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const codeStr = `${prefix ? prefix.trim().toUpperCase() + '-' : ''}${randStr}`;
      
      const newEntry = {
        id: 'code_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 6),
        code: codeStr,
        status: status === 'INFECTED' ? 'INFECTED' : 'SAFE',
        targetUser: '',
        isUsed: false,
        usedAt: null,
        usedBy: null,
        createdAt: new Date().toISOString(),
        note: note.trim() || `Tạo hàng loạt ${quantity} mã`
      };
      codes.unshift(newEntry);
      createdList.push(newEntry);
    }

    this.saveCodes(codes);
    return createdList;
  }

  deleteCode(id) {
    const codes = this.getCodes().filter(c => c.id !== id);
    this.saveCodes(codes);
  }

  deleteBulkCodes(ids = []) {
    const idSet = new Set(ids);
    const codes = this.getCodes().filter(c => !idSet.has(c.id));
    this.saveCodes(codes);
  }

  resetUsedCode(id) {
    const codes = this.getCodes().map(c => {
      if (c.id === id) {
        return { ...c, isUsed: false, usedAt: null, usedBy: null };
      }
      return c;
    });
    this.saveCodes(codes);
  }

  /**
   * Async Verify and consume a code (Queries server API first, falls back to local)
   * @param {string} inputCode 
   * @param {string} username 
   * @returns {Promise<{ success: boolean, status: 'SAFE' | 'INFECTED', code: string, usedBy: string }>}
   */
  async verifyAndConsumeCodeAsync(inputCode, username = '') {
    const cleanCode = (inputCode || '').trim().toUpperCase();
    if (!cleanCode) {
      throw new Error('Vui lòng nhập mã code xác thực!');
    }

    try {
      const json = await this.requestApi('/codes/consume', 'POST', { code: cleanCode, username: username.trim() });
      if (json && json.success) {
        // Update local storage to match
        await this.fetchFromServer();

        return {
          success: true,
          status: json.status,
          code: json.code,
          usedBy: json.usedBy
        };
      }
      if (json && !json.success && json.message) {
        throw new Error(json.message);
      }
      // Fallback
      return this.verifyAndConsumeCode(cleanCode, username);
    } catch (err) {
      if (err.message && (err.message.includes('đã được sử dụng') || err.message.includes('không hợp lệ') || err.message.includes('không có quyền'))) {
        throw err;
      }
      // Fallback to local
      return this.verifyAndConsumeCode(cleanCode, username);
    }
  }

  /**
   * Verify and consume a code (Synchronous local fallback)
   * @param {string} inputCode 
   * @param {string} username 
   * @returns { status: 'SAFE' | 'INFECTED', code: string }
   */
  verifyAndConsumeCode(inputCode, username = '') {
    const cleanCode = (inputCode || '').trim().toUpperCase();
    if (!cleanCode) {
      throw new Error('Vui lòng nhập mã code xác thực!');
    }

    const codes = this.getCodes();
    const foundIndex = codes.findIndex(c => c.code === cleanCode);

    if (foundIndex === -1) {
      throw new Error('Mã code không hợp lệ hoặc không tồn tại trên hệ thống!');
    }

    const codeObj = codes[foundIndex];

    if (codeObj.isUsed) {
      const usedTime = codeObj.usedAt ? new Date(codeObj.usedAt).toLocaleString('vi-VN') : 'trước đó';
      const userText = codeObj.usedBy ? ` bởi tài khoản "${codeObj.usedBy}"` : '';
      throw new Error(`Mã này đã được sử dụng${userText} vào lúc ${usedTime}. Mỗi mã chỉ được dùng 1 lần!`);
    }

    if (codeObj.targetUser && username && codeObj.targetUser.toLowerCase() !== username.trim().toLowerCase()) {
      throw new Error(`Mã này được cấp riêng cho tài khoản "${codeObj.targetUser}". Tài khoản "${username}" không có quyền sử dụng!`);
    }

    // Mark as used
    codes[foundIndex] = {
      ...codeObj,
      isUsed: true,
      usedAt: new Date().toISOString(),
      usedBy: username.trim() || 'Khách'
    };

    this.saveCodes(codes);

    return {
      success: true,
      status: codeObj.status, // 'SAFE' or 'INFECTED'
      code: codeObj.code,
      usedBy: codes[foundIndex].usedBy
    };
  }

  // --- BANNERS CRUD ---
  getBanners() {
    try {
      const data = localStorage.getItem(DB_KEYS.BANNERS);
      return data ? JSON.parse(data) : INITIAL_BANNERS;
    } catch (e) {
      return INITIAL_BANNERS;
    }
  }

  saveBanners(banners) {
    localStorage.setItem(DB_KEYS.BANNERS, JSON.stringify(banners));
    this.notifyUpdate();
  }

  updateBanner(id, updates) {
    const banners = this.getBanners().map(b => {
      if (String(b.id) === String(id)) {
        return { ...b, ...updates };
      }
      return b;
    });
    this.saveBanners(banners);
  }

  // --- CONFIG CRUD ---
  getConfig() {
    try {
      const data = localStorage.getItem(DB_KEYS.APP_CONFIG);
      const conf = data ? JSON.parse(data) : DEFAULT_CONFIG;
      return {
        ...DEFAULT_CONFIG,
        ...conf,
        supportTelegram: conf.supportTelegram || DEFAULT_CONFIG.supportTelegram
      };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }

  saveConfig(config) {
    localStorage.setItem(DB_KEYS.APP_CONFIG, JSON.stringify(config));
    this.notifyUpdate();
  }

  // --- ADMIN AUTH ---
  getAdminCreds() {
    try {
      const data = localStorage.getItem(DB_KEYS.ADMIN_CREDS);
      return data ? JSON.parse(data) : DEFAULT_ADMIN;
    } catch (e) {
      return DEFAULT_ADMIN;
    }
  }

  loginAdmin(username, password) {
    const creds = this.getAdminCreds();
    if (username === creds.username && password === creds.password) {
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      localStorage.setItem(DB_KEYS.ADMIN_AUTH, JSON.stringify({
        token,
        username,
        loginAt: new Date().toISOString()
      }));
      return { success: true, token };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu quản trị!' };
  }

  logoutAdmin() {
    localStorage.removeItem(DB_KEYS.ADMIN_AUTH);
  }

  isAdminLoggedIn() {
    try {
      const auth = localStorage.getItem(DB_KEYS.ADMIN_AUTH);
      return !!auth && !!JSON.parse(auth).token;
    } catch (e) {
      return false;
    }
  }

  changeAdminPassword(oldPassword, newPassword) {
    const creds = this.getAdminCreds();
    if (creds.password !== oldPassword) {
      throw new Error('Mật khẩu hiện tại không chính xác!');
    }
    if (!newPassword || newPassword.length < 4) {
      throw new Error('Mật khẩu mới phải có ít nhất 4 ký tự!');
    }
    creds.password = newPassword;
    localStorage.setItem(DB_KEYS.ADMIN_CREDS, JSON.stringify(creds));
    return true;
  }

  // --- RESET SYSTEM ---
  resetAll() {
    localStorage.removeItem(DB_KEYS.CODES);
    localStorage.removeItem(DB_KEYS.BANNERS);
    localStorage.removeItem(DB_KEYS.ADMIN_CREDS);
    localStorage.removeItem(DB_KEYS.APP_CONFIG);
    localStorage.removeItem(DB_KEYS.ADMIN_AUTH);
    this.init();
    this.notifyUpdate();
  }

  notifyUpdate() {
    window.dispatchEvent(new CustomEvent('xoa_ma_db_changed'));
  }
}

// Export singleton instance
window.db = new LocalDB();
