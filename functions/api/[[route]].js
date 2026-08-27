// Cloudflare Pages Functions Router for Tool Xoá Mã Nhà Cái
// Handles /api/data, /api/codes/consume, /api/sync, etc. natively on Cloudflare Pages (*.pages.dev)

const INITIAL_BANNERS = [
  { id: '1', name: 'LLWIN', imageUrl: './uploads/banner_1773924084584_dded26c768daf8.png', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 1 },
  { id: '2', name: 'Nhà cái #2', imageUrl: './uploads/banner_1773906314787_f3e8171ec5347.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: true, sortOrder: 2 },
  { id: '3', name: 'Nhà cái #3', imageUrl: './uploads/banner_1773906318979_ccb97ad68e11b8.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: true, sortOrder: 3 },
  { id: '4', name: 'Nhà cái #4', imageUrl: './uploads/banner_1773906324232_93aa07f91227a8.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: true, sortOrder: 4 },
  { id: '5', name: 'Nhà cái #5', imageUrl: './uploads/banner_1773906332137_0b4fd85fb41e58.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: true, sortOrder: 5 },
  { id: '6', name: 'Nhà cái #6', imageUrl: './uploads/banner_1773906336336_bfa4dbce56be38.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 6 },
  { id: '7', name: 'Nhà cái #7', imageUrl: './uploads/banner_1773906342898_6fa33c6ce09608.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 7 },
  { id: '8', name: 'Nhà cái #8', imageUrl: './uploads/banner_1773906352924_6fe235832ea528.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 8 },
  { id: '9', name: 'Nhà cái #9', imageUrl: './uploads/banner_1773906359570_f50389f41712a8.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 9 },
  { id: '10', name: 'Nhà cái #10', imageUrl: './uploads/banner_1773906368412_0c3b88bcfba588.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 10 },
  { id: '11', name: 'Nhà cái #11', imageUrl: './uploads/banner_1773906374032_b841e4aaeb3f78.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 11 },
  { id: '12', name: 'Nhà cái #12', imageUrl: './uploads/banner_1773906381279_61183aa2cead68.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 12 },
  { id: '13', name: 'Nhà cái #13', imageUrl: './uploads/banner_1773906386923_ea4a070ebafb38.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 13 },
  { id: '14', name: 'Nhà cái #14', imageUrl: './uploads/banner_1773906392094_5c2196ea85ff78.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 14 },
  { id: '15', name: 'Nhà cái #15', imageUrl: './uploads/banner_1773906399832_911653aa1cfe28.jpg', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 15 },
  { id: '16', name: 'Nhà cái #16', imageUrl: './uploads/banner_1773924094727_4592176cbb5d08.png', link: 'https://www.07llwin.com/?id=832516623', locked: false, sortOrder: 16 }
];

const INITIAL_CODES = [
  { id: 'code-dbc', code: 'DBC', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn' },
  { id: 'code-bro', code: 'BRO', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn' },
  { id: 'code-freze', code: 'FREZE', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn' },
  { id: 'code-safe-888', code: 'SAFE888', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn VIP' },
  { id: 'code-vip-888', code: 'VIP888', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn VIP' },
  { id: 'code-vip-777', code: 'VIP777', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn VIP' },
  { id: 'code-warn-111', code: 'WARN111', status: 'INFECTED', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã dính mã ẩn test' },
  { id: 'code-1', code: 'LLWIN-SAFE-888', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-26T00:00:00.000Z', note: 'Mã an toàn mặc định VIP' },
  { id: 'code-2', code: 'LLWIN-WARN-999', status: 'INFECTED', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-26T00:00:00.000Z', note: 'Mã dính mã ẩn test' }
];

const DEFAULT_CONFIG = {
  defaultHouseLink: 'https://www.07llwin.com/?id=832516623',
  supportTelegram: 'https://t.me/thosantp79',
  siteTitle: '[ TOOL XOÁ MÃ ẨN ]'
};

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

// In-memory fallback
let memoryDb = {
  banners: INITIAL_BANNERS,
  codes: INITIAL_CODES,
  config: DEFAULT_CONFIG,
  adminCreds: DEFAULT_ADMIN,
  updatedAt: new Date().toISOString()
};

function findKv(env) {
  if (!env || typeof env !== 'object') return null;
  if (env.XOAMA_KV && typeof env.XOAMA_KV.get === 'function') return env.XOAMA_KV;
  if (env.KV && typeof env.KV.get === 'function') return env.KV;
  if (env.DB && typeof env.DB.get === 'function') return env.DB;
  if (env.XOAMA && typeof env.XOAMA.get === 'function') return env.XOAMA;
  for (const key of Object.keys(env)) {
    if (env[key] && typeof env[key].get === 'function' && typeof env[key].put === 'function') {
      return env[key];
    }
  }
  return null;
}

async function getStoredDb(env) {
  const kv = findKv(env);
  if (kv) {
    try {
      const dataStr = await kv.get('db_data');
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (parsed && Array.isArray(parsed.codes)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('KV get error:', e);
    }
  }
  return memoryDb;
}

async function saveStoredDb(env, db) {
  db.updatedAt = new Date().toISOString();
  memoryDb = db;
  const kv = findKv(env);
  if (kv) {
    try {
      await kv.put('db_data', JSON.stringify(db));
    } catch (e) {
      console.error('KV put error:', e);
    }
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // --- API ROUTING ---
  const db = await getStoredDb(env);

  // GET /api/status
  if (path === '/api/status' && request.method === 'GET') {
    const kv = findKv(env);
    const envKeys = env ? Object.keys(env) : [];
    return jsonResponse({
      status: 'online',
      kvActive: !!kv,
      envBindingsFound: envKeys,
      codesCount: (db.codes || []).length,
      updatedAt: db.updatedAt
    });
  }

  // GET /api/data
  if (path === '/api/data' && request.method === 'GET') {
    return jsonResponse({
      success: true,
      banners: db.banners || INITIAL_BANNERS,
      codes: db.codes || INITIAL_CODES,
      config: db.config || DEFAULT_CONFIG,
      adminCreds: db.adminCreds || DEFAULT_ADMIN,
      updatedAt: db.updatedAt
    });
  }

  // POST /api/sync
  if (path === '/api/sync' && request.method === 'POST') {
    try {
      const body = await request.json();
      if (body.codes && Array.isArray(body.codes)) {
        db.codes = body.codes;
      }
      if (body.banners && Array.isArray(body.banners)) {
        db.banners = body.banners;
      }
      if (body.config && typeof body.config === 'object') {
        db.config = { ...db.config, ...body.config };
      }
      if (body.adminCreds && typeof body.adminCreds === 'object') {
        db.adminCreds = { ...db.adminCreds, ...body.adminCreds };
      }
      await saveStoredDb(env, db);
      return jsonResponse({ success: true, db });
    } catch (e) {
      return jsonResponse({ success: false, message: 'Invalid payload' }, 400);
    }
  }

  // POST /api/codes/consume
  if (path === '/api/codes/consume' && request.method === 'POST') {
    try {
      const body = await request.json();
      const cleanCode = (body.code || '').trim().toUpperCase();
      const username = (body.username || '').trim();

      if (!cleanCode) {
        return jsonResponse({ success: false, message: 'Vui lòng nhập mã code xác thực!' }, 400);
      }

      const codes = db.codes || [];
      const foundIndex = codes.findIndex(c => c.code === cleanCode);

      if (foundIndex === -1) {
        return jsonResponse({ success: false, message: 'Mã code không hợp lệ hoặc không tồn tại trên hệ thống!' }, 404);
      }

      const codeObj = codes[foundIndex];
      if (codeObj.isUsed) {
        const usedTime = codeObj.usedAt ? new Date(codeObj.usedAt).toLocaleString('vi-VN') : 'trước đó';
        const userText = codeObj.usedBy ? ` bởi tài khoản "${codeObj.usedBy}"` : '';
        return jsonResponse({
          success: false,
          message: `Mã này đã được sử dụng${userText} vào lúc ${usedTime}. Mỗi mã chỉ được dùng 1 lần!`
        }, 400);
      }

      if (codeObj.targetUser && username && codeObj.targetUser.toLowerCase() !== username.toLowerCase()) {
        return jsonResponse({
          success: false,
          message: `Mã này được cấp riêng cho tài khoản "${codeObj.targetUser}". Tài khoản "${username}" không có quyền sử dụng!`
        }, 403);
      }

      // Mark code as used
      codes[foundIndex] = {
        ...codeObj,
        isUsed: true,
        usedAt: new Date().toISOString(),
        usedBy: username || 'Khách'
      };
      db.codes = codes;
      await saveStoredDb(env, db);

      return jsonResponse({
        success: true,
        status: codeObj.status,
        code: codeObj.code,
        usedBy: codes[foundIndex].usedBy
      });
    } catch (e) {
      return jsonResponse({ success: false, message: 'Lỗi xử lý yêu cầu' }, 500);
    }
  }

  // POST /api/codes/add
  if (path === '/api/codes/add' && request.method === 'POST') {
    try {
      const body = await request.json();
      db.codes = db.codes || [];
      if (body.bulk && Array.isArray(body.codes)) {
        for (const item of body.codes) {
          if (!db.codes.some(c => c.code === item.code)) {
            db.codes.unshift(item);
          }
        }
      } else if (body.code) {
        const cleanCode = body.code.trim().toUpperCase();
        if (db.codes.some(c => c.code === cleanCode)) {
          return jsonResponse({ success: false, message: `Mã "${cleanCode}" đã tồn tại trên hệ thống!` }, 400);
        }
        db.codes.unshift(body);
      }
      await saveStoredDb(env, db);
      return jsonResponse({ success: true, codes: db.codes });
    } catch (e) {
      return jsonResponse({ success: false, message: 'Lỗi thêm mã' }, 500);
    }
  }

  // POST /api/codes/delete
  if (path === '/api/codes/delete' && request.method === 'POST') {
    try {
      const body = await request.json();
      db.codes = db.codes || [];
      if (body.ids && Array.isArray(body.ids)) {
        const idSet = new Set(body.ids);
        db.codes = db.codes.filter(c => !idSet.has(c.id));
      } else if (body.id) {
        db.codes = db.codes.filter(c => c.id !== body.id);
      }
      await saveStoredDb(env, db);
      return jsonResponse({ success: true, codes: db.codes });
    } catch (e) {
      return jsonResponse({ success: false, message: 'Lỗi xoá mã' }, 500);
    }
  }

  // POST /api/reset
  if (path === '/api/reset' && request.method === 'POST') {
    const initialDb = {
      banners: INITIAL_BANNERS,
      codes: INITIAL_CODES,
      config: DEFAULT_CONFIG,
      adminCreds: DEFAULT_ADMIN,
      updatedAt: new Date().toISOString()
    };
    await saveStoredDb(env, initialDb);
    return jsonResponse({ success: true, db: initialDb });
  }

  return jsonResponse({ success: false, message: 'Endpoint not found' }, 404);
}
