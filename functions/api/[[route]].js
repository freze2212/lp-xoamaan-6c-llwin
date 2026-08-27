// Cloudflare Pages Functions Router for Tool Xoá Mã Nhà Cái
// Handles /api/data, /api/codes/consume, /api/sync, etc. natively on Cloudflare Pages (*.pages.dev)

const CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a04377347036e4';

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

const INITIAL_CODES = [
  { id: 'code-123', code: '123', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn test' },
  { id: 'code-1233', code: '1233', status: 'SAFE', targetUser: '', isUsed: false, usedAt: null, usedBy: null, createdAt: '2026-08-27T00:00:00.000Z', note: 'Mã an toàn test' },
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

async function getStoredDb(env) {
  // 1. Try Cloud Central Database
  try {
    const res = await fetch(CLOUD_DB_URL, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        if (Array.isArray(json.data.codes) && json.data.codes.length > 0) {
          memoryDb.codes = json.data.codes;
        }
        if (Array.isArray(json.data.banners) && json.data.banners.length > 0) {
          memoryDb.banners = json.data.banners;
        }
        if (json.data.config) {
          memoryDb.config = { ...memoryDb.config, ...json.data.config };
        }
        if (json.data.adminCreds) {
          memoryDb.adminCreds = { ...memoryDb.adminCreds, ...json.data.adminCreds };
        }
        return memoryDb;
      }
    }
  } catch (e) {
    console.error('Cloud DB fetch error:', e);
  }

  // 2. Fallback to KV or memory
  return memoryDb;
}

async function saveStoredDb(env, db) {
  db.updatedAt = new Date().toISOString();
  memoryDb = db;

  // Save to Cloud Central Database
  try {
    await fetch(CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'xoaip_codes_db',
        data: {
          codes: db.codes || [],
          banners: db.banners || [],
          config: db.config || {},
          adminCreds: db.adminCreds || {}
        }
      })
    });
  } catch (e) {
    console.error('Cloud DB save error:', e);
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

      const codes = db.codes || INITIAL_CODES;
      let foundIndex = codes.findIndex(c => c.code === cleanCode);

      // Smart Code Rule Engine: Adopt admin patterns across any network / isolate seamlessly
      if (foundIndex === -1) {
        const isAdminPrefix = /^(LLWIN|VIP|SAFE|WARN|INFECT|CODE|SV|XOAMA|WIN|MAX|TEST)-/i.test(cleanCode);
        const isRecognizedAdminCode = [
          '123', '1233', '888', '999', '777', '666', '6868', '7979', '9999', '111', '222', '333', '555',
          'DBC', 'BRO', 'FREZE', 'ADMIN', 'SAFE888', 'VIP888', 'VIP777', 'WARN111', 'LLWIN', 'MAXWIN', 'WIN'
        ].includes(cleanCode);

        if (isAdminPrefix || isRecognizedAdminCode) {
          const isInfected = cleanCode.includes('WARN') || cleanCode.includes('INFECT') || cleanCode.includes('LOI') || cleanCode.includes('111');
          const newCodeObj = {
            id: `code-dyn-${Date.now()}`,
            code: cleanCode,
            status: isInfected ? 'INFECTED' : 'SAFE',
            targetUser: '',
            isUsed: false,
            usedAt: null,
            usedBy: null,
            createdAt: new Date().toISOString(),
            note: 'Mã hệ thống đồng bộ Admin'
          };
          codes.unshift(newCodeObj);
          foundIndex = 0;
        } else {
          return jsonResponse({ success: false, message: 'Mã code không hợp lệ hoặc không tồn tại trên hệ thống!' }, 404);
        }
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
          const cCode = (item.code || '').trim().toUpperCase();
          if (cCode && !db.codes.some(c => c.code === cCode)) {
            db.codes.unshift({
              id: item.id || `code-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              code: cCode,
              status: item.status || 'SAFE',
              targetUser: (item.targetUser || '').trim(),
              isUsed: false,
              usedAt: null,
              usedBy: null,
              createdAt: new Date().toISOString(),
              note: item.note || ''
            });
          }
        }
      } else if (body.code) {
        const cleanCode = body.code.trim().toUpperCase();
        if (db.codes.some(c => c.code === cleanCode)) {
          return jsonResponse({ success: false, message: `Mã "${cleanCode}" đã tồn tại trên hệ thống!` }, 400);
        }
        const newCode = {
          id: body.id || `code-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          code: cleanCode,
          status: body.status || 'SAFE',
          targetUser: (body.targetUser || '').trim(),
          isUsed: false,
          usedAt: null,
          usedBy: null,
          createdAt: new Date().toISOString(),
          note: body.note || (body.status === 'SAFE' ? 'Mã an toàn' : 'Dính mã ẩn')
        };
        db.codes.unshift(newCode);
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
