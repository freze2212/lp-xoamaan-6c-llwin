/**
 * Admin Dashboard Logic for Tool Xoá Mã Nhà Cái
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Auth
  const loginScreen = document.getElementById('admin-login-screen');
  const dashboardScreen = document.getElementById('admin-dashboard-screen');
  const loginForm = document.getElementById('admin-login-form');
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-admin-logout');

  // DOM Elements - Navigation Tabs
  const navButtons = document.querySelectorAll('.admin-nav-btn[data-tab]');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  // DOM Elements - Stats
  const statTotal = document.getElementById('stat-total-codes');
  const statUnused = document.getElementById('stat-unused-codes');
  const statSafe = document.getElementById('stat-safe-codes');
  const statInfected = document.getElementById('stat-infected-codes');

  // DOM Elements - Code Forms
  const formSingleCode = document.getElementById('form-create-single-code');
  const formBulkCodes = document.getElementById('form-create-bulk-codes');
  const btnToggleBulk = document.getElementById('btn-toggle-bulk');
  const singleStatus = document.getElementById('single-code-status');
  const singleName = document.getElementById('single-code-name');
  const singleUser = document.getElementById('single-code-user');
  const singleNote = document.getElementById('single-code-note');

  const bulkStatus = document.getElementById('bulk-code-status');
  const bulkPrefix = document.getElementById('bulk-code-prefix');
  const bulkQty = document.getElementById('bulk-code-qty');
  const bulkNote = document.getElementById('bulk-code-note');

  // DOM Elements - Table & Filter
  const codesTableBody = document.getElementById('codes-table-body');
  const searchCodeInput = document.getElementById('search-code-input');
  const filterStatusSelect = document.getElementById('filter-status-select');
  const filterUsedSelect = document.getElementById('filter-used-select');
  const btnCopyAllUnused = document.getElementById('btn-copy-all-unused');

  // DOM Elements - Banners & Settings
  const llwinLinkInput = document.getElementById('llwin-link-input');
  const btnSaveLlwinLink = document.getElementById('btn-save-llwin-link');
  const bannersTableBody = document.getElementById('banners-table-body');
  const formChangePassword = document.getElementById('form-change-password');
  const btnResetSystem = document.getElementById('btn-reset-system');
  const toastContainer = document.getElementById('toast-container');

  // State
  let isBulkMode = false;

  // Initialize
  checkAuth();

  // --- AUTHENTICATION ---
  function checkAuth() {
    if (window.db.isAdminLoggedIn()) {
      loginScreen.style.display = 'none';
      dashboardScreen.style.display = 'block';
      loadDashboardData();
    } else {
      loginScreen.style.display = 'flex';
      dashboardScreen.style.display = 'none';
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = loginUsernameInput.value.trim();
    const pass = loginPasswordInput.value;

    const result = window.db.loginAdmin(user, pass);
    if (result.success) {
      loginError.style.display = 'none';
      showToast('Đăng nhập thành công!', 'success');
      checkAuth();
    } else {
      loginError.textContent = result.message;
      loginError.style.display = 'block';
    }
  });

  btnLogout.addEventListener('click', () => {
    window.db.logoutAdmin();
    showToast('Đã đăng xuất quản trị.', 'success');
    checkAuth();
  });

  // --- TAB NAVIGATION ---
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(tab => {
        tab.style.display = tab.id === targetTab ? 'block' : 'none';
      });
    });
  });

  // Toggle Bulk Mode
  btnToggleBulk.addEventListener('click', () => {
    isBulkMode = !isBulkMode;
    if (isBulkMode) {
      formSingleCode.style.display = 'none';
      formBulkCodes.style.display = 'block';
      btnToggleBulk.textContent = '📝 Chuyển sang Tạo Mã Đơn';
    } else {
      formSingleCode.style.display = 'block';
      formBulkCodes.style.display = 'none';
      btnToggleBulk.textContent = '📦 Chuyển sang Tạo Hàng Loạt';
    }
  });

  // --- CODE CREATION ---
  formSingleCode.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = formSingleCode.querySelector('button[type="submit"]');
    const origText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '⏳ Đang lưu lên máy chủ...';

    const status = singleStatus.value;
    let codeStr = singleName.value.trim().toUpperCase();
    const targetUser = singleUser.value.trim();
    const note = singleNote.value.trim();

    // Auto generate with secret signature algorithm if empty
    if (!codeStr) {
      const type = status === 'SAFE' ? 'S' : 'W';
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let seed = '';
      for (let i = 0; i < 4; i++) {
        seed += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      let sum = 0;
      for (let i = 0; i < seed.length; i++) {
        sum += seed.charCodeAt(i) * (i + 3);
      }
      const checksum = String((sum * 7 + 13) % 1000).padStart(3, '0');
      codeStr = `LLWIN-${type}${seed}${checksum}`;
    }

    try {
      const created = await window.db.addCodeAsync({
        code: codeStr,
        status,
        targetUser,
        note: note || (status === 'SAFE' ? 'Mã an toàn' : 'Dính mã ẩn')
      });

      showToast(`Đã lưu mã lên Server thành công: ${created.code}`, 'success');
      singleName.value = '';
      singleUser.value = '';
      singleNote.value = '';
      loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = origText;
    }
  });

  formBulkCodes.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = formBulkCodes.querySelector('button[type="submit"]');
    const origText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '⏳ Đang tạo và lưu lên máy chủ...';

    const status = bulkStatus.value;
    const prefix = bulkPrefix.value.trim() || 'VIP';
    const quantity = parseInt(bulkQty.value, 10) || 5;
    const note = bulkNote.value.trim();

    try {
      const list = await window.db.addBulkCodesAsync({
        quantity,
        prefix,
        status,
        note
      });

      showToast(`Đã lưu thành công ${list.length} mã lên Server!`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = origText;
    }
  });

  // --- DATA LOADING & STATS ---
  function loadDashboardData() {
    const codes = window.db.getCodes();
    const banners = window.db.getBanners();
    const config = window.db.getConfig();

    // Update Stats
    const total = codes.length;
    const unused = codes.filter(c => !c.isUsed).length;
    const safe = codes.filter(c => c.status === 'SAFE').length;
    const infected = codes.filter(c => c.status === 'INFECTED').length;

    statTotal.textContent = total;
    statUnused.textContent = unused;
    statSafe.textContent = safe;
    statInfected.textContent = infected;

    // Render Tables
    renderCodesTable();
    renderBannersTable(banners);

    // LLWIN Link input & Telegram Link input & Cloud API
    llwinLinkInput.value = config.defaultHouseLink || 'https://www.07llwin.com/?id=832516623';
    const telegramInput = document.getElementById('telegram-link-input');
    if (telegramInput) {
      telegramInput.value = config.supportTelegram || 'https://t.me/thosantp79';
    }
    const cloudApiInput = document.getElementById('cloud-api-input');
    if (cloudApiInput) {
      cloudApiInput.value = config.cloudApiUrl || '';
    }
  }

  // --- CODES TABLE & FILTERING ---
  function renderCodesTable() {
    const allCodes = window.db.getCodes();
    const searchTerm = searchCodeInput.value.trim().toLowerCase();
    const statusFilter = filterStatusSelect.value;
    const usedFilter = filterUsedSelect.value;

    const filtered = allCodes.filter(c => {
      // Search
      const matchSearch = !searchTerm || 
        c.code.toLowerCase().includes(searchTerm) || 
        (c.targetUser && c.targetUser.toLowerCase().includes(searchTerm)) ||
        (c.usedBy && c.usedBy.toLowerCase().includes(searchTerm)) ||
        (c.note && c.note.toLowerCase().includes(searchTerm));

      // Status
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;

      // Used
      const matchUsed = usedFilter === 'ALL' || 
        (usedFilter === 'USED' && c.isUsed) || 
        (usedFilter === 'UNUSED' && !c.isUsed);

      return matchSearch && matchStatus && matchUsed;
    });

    codesTableBody.innerHTML = '';

    if (filtered.length === 0) {
      codesTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: #64748b;">
            Không tìm thấy mã nào phù hợp với bộ lọc.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(codeItem => {
      const tr = document.createElement('tr');

      const isSafe = codeItem.status === 'SAFE';
      const isUsed = codeItem.isUsed;

      const formattedUsedTime = codeItem.usedAt ? new Date(codeItem.usedAt).toLocaleString('vi-VN') : '—';
      const formattedCreatedTime = new Date(codeItem.createdAt).toLocaleDateString('vi-VN');

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <strong style="font-family: var(--font-mono); color: #f8fafc; font-size: 0.95rem;">${codeItem.code}</strong>
            <button type="button" class="btn-admin-secondary btn-copy" data-code="${codeItem.code}" title="Sao chép mã" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">
              📋 Copy
            </button>
          </div>
        </td>
        <td>
          <span class="badge ${isSafe ? 'badge-safe' : 'badge-infected'}">
            ${isSafe ? '🟢 Mã An Toàn' : '🔴 Dính Mã Ẩn'}
          </span>
        </td>
        <td>
          ${codeItem.targetUser ? `<span style="color: #38bdf8; font-weight: 600;">${codeItem.targetUser}</span>` : '<span style="color: #64748b;">Dùng chung</span>'}
        </td>
        <td>
          <span class="badge ${isUsed ? 'badge-used' : 'badge-unused'}">
            ${isUsed ? '⚪ Đã Sử Dụng' : '🔵 Chưa Sử Dụng'}
          </span>
        </td>
        <td style="font-size: 0.82rem;">
          ${isUsed ? `<strong>${codeItem.usedBy || 'Khách'}</strong><br><span style="color: #94a3b8;">${formattedUsedTime}</span>` : '<span style="color: #64748b;">—</span>'}
        </td>
        <td style="font-size: 0.85rem; color: #94a3b8;">
          ${codeItem.note || '—'}
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            ${isUsed ? `
              <button type="button" class="btn-admin-secondary btn-reset-code" data-id="${codeItem.id}" title="Đặt lại trạng thái chưa dùng">
                🔄 Mở lại
              </button>
            ` : ''}
            <button type="button" class="btn-admin-danger btn-delete-code-item" data-id="${codeItem.id}" title="Xoá mã">
              🗑️ Xoá
            </button>
          </div>
        </td>
      `;

      codesTableBody.appendChild(tr);
    });

    // Attach actions
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = btn.getAttribute('data-code');
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Đã sao chép mã: ${code}`, 'success');
        });
      });
    });

    document.querySelectorAll('.btn-reset-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.db.resetUsedCode(id);
        showToast('Đã mở lại mã (chuyển về Chưa Sử Dụng)', 'success');
        loadDashboardData();
      });
    });

    document.querySelectorAll('.btn-delete-code-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Bạn có chắc chắn muốn xoá mã này không?')) {
          window.db.deleteCode(id);
          showToast('Đã xoá mã thành công!', 'success');
          loadDashboardData();
        }
      });
    });
  }

  // Filter Listeners
  searchCodeInput.addEventListener('input', renderCodesTable);
  filterStatusSelect.addEventListener('change', renderCodesTable);
  filterUsedSelect.addEventListener('change', renderCodesTable);

  // Copy all unused codes
  btnCopyAllUnused.addEventListener('click', () => {
    const unused = window.db.getCodes().filter(c => !c.isUsed);
    if (unused.length === 0) {
      showToast('Không có mã nào chưa sử dụng để sao chép!', 'error');
      return;
    }

    const textList = unused.map(c => `${c.code} [${c.status === 'SAFE' ? 'Mã An Toàn' : 'Dính Mã Ẩn'}]`).join('\n');
    navigator.clipboard.writeText(textList).then(() => {
      showToast(`Đã sao chép ${unused.length} mã chưa dùng vào bộ nhớ tạm!`, 'success');
    });
  });

  // --- BANNERS MANAGEMENT ---
  function renderBannersTable(banners) {
    bannersTableBody.innerHTML = '';

    banners.forEach((banner, index) => {
      const tr = document.createElement('tr');
      const isLlwin = banner.id === 'llwin';

      tr.innerHTML = `
        <td>
          <span style="font-weight: 800; color: ${isLlwin ? '#fbbf24' : '#94a3b8'};">
            #${index + 1} ${isLlwin ? '🔥 (HOT)' : ''}
          </span>
        </td>
        <td>
          <img src="${banner.imageUrl}" alt="${banner.name}" style="width: 80px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(148,163,184,0.2);" />
        </td>
        <td>
          <strong style="color: ${isLlwin ? '#fbbf24' : '#f8fafc'};">${banner.name}</strong>
        </td>
        <td>
          <span class="badge ${banner.locked ? 'badge-infected' : 'badge-safe'}">
            ${banner.locked ? '🔒 Đã Khoá' : '🟢 Hoạt Động'}
          </span>
        </td>
        <td style="font-size: 0.85rem; color: #38bdf8;">
          ${banner.link || '—'}
        </td>
      `;
      bannersTableBody.appendChild(tr);
    });
  }

  btnSaveLlwinLink.addEventListener('click', () => {
    const newLink = llwinLinkInput.value.trim();
    if (!newLink) {
      showToast('Vui lòng nhập đường link hoạt động hợp lệ!', 'error');
      return;
    }

    const config = window.db.getConfig();
    config.defaultHouseLink = newLink;
    window.db.saveConfig(config);

    // Also update banner llwin link
    window.db.updateBanner('llwin', { link: newLink });
    showToast('Đã lưu đường link hoạt động LLWIN thành công!', 'success');
    loadDashboardData();
  });

  // --- SETTINGS ---
  const formChangeTelegram = document.getElementById('form-change-telegram');
  if (formChangeTelegram) {
    formChangeTelegram.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTele = document.getElementById('telegram-link-input').value.trim();
      if (!newTele) {
        showToast('Vui lòng nhập link Telegram hợp lệ!', 'error');
        return;
      }
      const config = window.db.getConfig();
      config.supportTelegram = newTele;
      window.db.saveConfig(config);
      showToast('Đã lưu link Telegram hỗ trợ thành công!', 'success');
    });
  }

  const formCloudSync = document.getElementById('form-cloud-sync');
  if (formCloudSync) {
    formCloudSync.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cloudUrl = document.getElementById('cloud-api-input').value.trim();
      const config = window.db.getConfig();
      config.cloudApiUrl = cloudUrl;
      window.db.saveConfig(config);
      showToast('Đã lưu cấu hình Cloud API! Đang đồng bộ...', 'success');
      await window.db.fetchFromServer();
      loadDashboardData();
    });
  }

  formChangePassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPass = document.getElementById('old-admin-pass').value;
    const newPass = document.getElementById('new-admin-pass').value;

    try {
      window.db.changeAdminPassword(oldPass, newPass);
      showToast('Đổi mật khẩu Admin thành công! Vui lòng nhớ mật khẩu mới.', 'success');
      document.getElementById('old-admin-pass').value = '';
      document.getElementById('new-admin-pass').value = '';
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  btnResetSystem.addEventListener('click', () => {
    if (confirm('CẢNH BÁO: Thao tác này sẽ xoá trắng toàn bộ mã và trả hệ thống về ban đầu. Bạn có chắc chắn?')) {
      window.db.resetAll();
      showToast('Hệ thống đã được đặt lại về mặc định!', 'success');
      loadDashboardData();
    }
  });

  // --- TOAST HELPER ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : '❌'}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
