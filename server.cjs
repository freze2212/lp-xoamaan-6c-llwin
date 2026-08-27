const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db_data.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

// Initial default database structure
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
  {
    id: 'code-1',
    code: 'LLWIN-SAFE-888',
    status: 'SAFE',
    targetUser: '',
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

const DEFAULT_CONFIG = {
  defaultHouseLink: 'https://www.07llwin.com/?id=832516623',
  supportTelegram: 'https://t.me/thosantp79',
  siteTitle: '[ TOOL XOÁ MÃ ẨN ]'
};

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db_data.json:', err.message);
  }

  const initialDb = {
    banners: INITIAL_BANNERS,
    codes: INITIAL_CODES,
    config: DEFAULT_CONFIG,
    adminCreds: DEFAULT_ADMIN,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data) {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db_data.json:', err.message);
  }
}

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  try {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      return res.end();
    }

    const parsedUrl = req.url.split('?')[0];

    // --- API ROUTES ---
    if (parsedUrl.startsWith('/api/')) {
      const db = loadDatabase();

      // GET /api/data - Full database fetch
      if (parsedUrl === '/api/data' && req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          banners: db.banners,
          codes: db.codes,
          config: db.config,
          adminCreds: db.adminCreds,
          updatedAt: db.updatedAt
        });
      }

      // POST /api/sync - Full sync / merge
      if (parsedUrl === '/api/sync' && req.method === 'POST') {
        const body = await parseBody(req);
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
        saveDatabase(db);
        return sendJson(res, 200, { success: true, db });
      }

      // POST /api/codes/consume - Verify & Consume code
      if (parsedUrl === '/api/codes/consume' && req.method === 'POST') {
        const body = await parseBody(req);
        const cleanCode = (body.code || '').trim().toUpperCase();
        const username = (body.username || '').trim();

        if (!cleanCode) {
          return sendJson(res, 400, { success: false, message: 'Vui lòng nhập mã code xác thực!' });
        }

        const foundIndex = db.codes.findIndex(c => c.code === cleanCode);
        if (foundIndex === -1) {
          return sendJson(res, 404, { success: false, message: 'Mã code không hợp lệ hoặc không tồn tại trên hệ thống!' });
        }

        const codeObj = db.codes[foundIndex];
        if (codeObj.isUsed) {
          const usedTime = codeObj.usedAt ? new Date(codeObj.usedAt).toLocaleString('vi-VN') : 'trước đó';
          const userText = codeObj.usedBy ? ` bởi tài khoản "${codeObj.usedBy}"` : '';
          return sendJson(res, 400, {
            success: false,
            message: `Mã này đã được sử dụng${userText} vào lúc ${usedTime}. Mỗi mã chỉ được dùng 1 lần!`
          });
        }

        if (codeObj.targetUser && username && codeObj.targetUser.toLowerCase() !== username.toLowerCase()) {
          return sendJson(res, 403, {
            success: false,
            message: `Mã này được cấp riêng cho tài khoản "${codeObj.targetUser}". Tài khoản "${username}" không có quyền sử dụng!`
          });
        }

        // Mark code as used
        db.codes[foundIndex] = {
          ...codeObj,
          isUsed: true,
          usedAt: new Date().toISOString(),
          usedBy: username || 'Khách'
        };
        saveDatabase(db);

        return sendJson(res, 200, {
          success: true,
          status: codeObj.status,
          code: codeObj.code,
          usedBy: db.codes[foundIndex].usedBy
        });
      }

      // POST /api/codes/add - Add code or bulk codes
      if (parsedUrl === '/api/codes/add' && req.method === 'POST') {
        const body = await parseBody(req);
        if (body.bulk && Array.isArray(body.codes)) {
          for (const item of body.codes) {
            if (!db.codes.some(c => c.code === item.code)) {
              db.codes.unshift(item);
            }
          }
        } else if (body.code) {
          const cleanCode = body.code.trim().toUpperCase();
          if (db.codes.some(c => c.code === cleanCode)) {
            return sendJson(res, 400, { success: false, message: `Mã "${cleanCode}" đã tồn tại trên hệ thống!` });
          }
          db.codes.unshift(body);
        }
        saveDatabase(db);
        return sendJson(res, 200, { success: true, codes: db.codes });
      }

      // POST /api/codes/delete - Delete code(s)
      if (parsedUrl === '/api/codes/delete' && req.method === 'POST') {
        const body = await parseBody(req);
        if (body.ids && Array.isArray(body.ids)) {
          const idSet = new Set(body.ids);
          db.codes = db.codes.filter(c => !idSet.has(c.id));
        } else if (body.id) {
          db.codes = db.codes.filter(c => c.id !== body.id);
        }
        saveDatabase(db);
        return sendJson(res, 200, { success: true, codes: db.codes });
      }

      // POST /api/codes/reset - Reset a used code
      if (parsedUrl === '/api/codes/reset' && req.method === 'POST') {
        const body = await parseBody(req);
        db.codes = db.codes.map(c => {
          if (c.id === body.id) {
            return { ...c, isUsed: false, usedAt: null, usedBy: null };
          }
          return c;
        });
        saveDatabase(db);
        return sendJson(res, 200, { success: true, codes: db.codes });
      }

      // POST /api/banners - Save banners
      if (parsedUrl === '/api/banners' && req.method === 'POST') {
        const body = await parseBody(req);
        if (body.banners && Array.isArray(body.banners)) {
          db.banners = body.banners;
          saveDatabase(db);
        }
        return sendJson(res, 200, { success: true, banners: db.banners });
      }

      // POST /api/config - Save config
      if (parsedUrl === '/api/config' && req.method === 'POST') {
        const body = await parseBody(req);
        if (body.config) {
          db.config = { ...db.config, ...body.config };
          saveDatabase(db);
        }
        return sendJson(res, 200, { success: true, config: db.config });
      }

      // POST /api/reset - Reset all to default
      if (parsedUrl === '/api/reset' && req.method === 'POST') {
        const initialDb = {
          banners: INITIAL_BANNERS,
          codes: INITIAL_CODES,
          config: DEFAULT_CONFIG,
          adminCreds: DEFAULT_ADMIN,
          updatedAt: new Date().toISOString()
        };
        saveDatabase(initialDb);
        return sendJson(res, 200, { success: true, db: initialDb });
      }

      return sendJson(res, 404, { success: false, message: 'Endpoint not found' });
    }

    // --- STATIC FILE SERVING ---
    let reqUrl = parsedUrl;
    if (reqUrl === '/') reqUrl = '/index.html';

    let filePath = path.join(__dirname, reqUrl);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'public', reqUrl);
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
      const stream = fs.createReadStream(filePath);
      stream.on('error', (err) => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('500 Internal Server Error');
        }
      });
      stream.pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
    }
  } catch (err) {
    console.error('Request error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({ error: err.message }));
    }
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  loadDatabase();
});

