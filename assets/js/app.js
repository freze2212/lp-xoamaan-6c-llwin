/**
 * Main Landing Page Logic for Tool Xoá Mã Nhà Cái
 */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let selectedHouseId = 'llwin';
  let isScanning = false;
  let currentActionType = 'delete'; // 'delete' or 'chuyenXau'

  // DOM Elements
  const usernameInput = document.getElementById('username-input');
  const btnDeleteCode = document.getElementById('btn-delete-code');
  const btnChuyenXau = document.getElementById('btn-chuyen-xau');
  const bannersGrid = document.getElementById('banners-grid');

  // Security Info Elements
  const userIpEl = document.getElementById('user-ip');
  const userDeviceEl = document.getElementById('user-device');
  const userOsEl = document.getElementById('user-os');
  const userBrowserEl = document.getElementById('user-browser');

  // Hacker Terminal Elements
  const hackerOverlay = document.getElementById('hacker-overlay');
  const hackerProgressBar = document.getElementById('hacker-progress-bar');
  const hackerProgressText = document.getElementById('hacker-progress-text');
  const hackerBody = document.getElementById('hacker-body');

  // Modals
  const codeModalOverlay = document.getElementById('code-modal-overlay');
  const codeInput = document.getElementById('code-input');
  const codeModalError = document.getElementById('code-modal-error');
  const btnCancelCode = document.getElementById('btn-cancel-code');
  const btnSubmitCode = document.getElementById('btn-submit-code');

  const resultModalOverlay = document.getElementById('result-modal-overlay');
  const resultModalCard = document.getElementById('result-modal-card');
  const resultTitle = document.getElementById('result-title');
  const resultText = document.getElementById('result-text');
  const resultActionArea = document.getElementById('result-action-area');
  const btnCloseResult = document.getElementById('btn-close-result');

  // 1. Detect Client Environment
  detectClientInfo();

  // 2. Render Banners with LLWIN first
  renderBanners();

  // Listen to DB updates
  window.addEventListener('xoa_ma_db_changed', () => {
    renderBanners();
  });

  // 3. Setup Button Event Listeners
  btnDeleteCode.addEventListener('click', () => {
    handleOpenCodePrompt('delete');
  });

  btnChuyenXau.addEventListener('click', () => {
    handleOpenCodePrompt('chuyenXau');
  });

  btnCancelCode.addEventListener('click', () => {
    closeCodeModal();
  });

  btnSubmitCode.addEventListener('click', () => {
    handleVerifyAndRun();
  });

  codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleVerifyAndRun();
    }
  });

  btnCloseResult.addEventListener('click', () => {
    resultModalOverlay.style.display = 'none';
  });

  // --- FUNCTIONS ---

  function detectClientInfo() {
    // Detect device
    const ua = navigator.userAgent || '';
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    userDeviceEl.textContent = isMobile ? 'Mobile' : 'Desktop';

    // Detect OS
    let os = 'Unknown';
    if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
    else if (/Windows NT/i.test(ua)) os = 'Windows';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    userOsEl.textContent = os;

    // Detect Browser
    let browser = 'Unknown';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Chrome';
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    userBrowserEl.textContent = browser;

    // Fetch Public IP
    fetch('https://api.ipify.org?format=json', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        userIpEl.textContent = data.ip || '118.69.182.45';
      })
      .catch(() => {
        userIpEl.textContent = '118.69.182.45';
      });
  }

  let lastRenderedBannersJson = '';

  function renderBanners() {
    const banners = window.db.getBanners();
    const currentJson = JSON.stringify(banners);

    // Skip re-rendering if data is identical (Anti-Flicker)
    if (currentJson === lastRenderedBannersJson && bannersGrid.children.length > 0) {
      updateActiveBannerSelection();
      return;
    }

    lastRenderedBannersJson = currentJson;
    bannersGrid.innerHTML = '';

    banners.forEach((banner) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.bannerId = banner.id;
      const isLlwin = banner.id === 'llwin';
      const isActive = selectedHouseId === banner.id;

      button.className = `grid-item ${isLlwin ? 'grid-item-llwin' : ''} ${isActive ? 'active' : ''}`;
      button.setAttribute('aria-label', banner.name || `Banner ${banner.id}`);
      button.title = `${banner.name || 'Nhà cái'} ${isLlwin ? '(Khuyên dùng - LLWIN)' : ''}`;

      const imgSrc = banner.imageUrl || './uploads/banner_llwin.svg';

      button.innerHTML = `
        <img class="grid-item-image" src="${imgSrc}" alt="${banner.name || 'Banner'}" />
      `;

      button.addEventListener('click', () => {
        selectedHouseId = banner.id;
        updateActiveBannerSelection();
      });

      bannersGrid.appendChild(button);
    });
  }

  function updateActiveBannerSelection() {
    const buttons = bannersGrid.querySelectorAll('.grid-item');
    buttons.forEach((btn) => {
      if (btn.dataset.bannerId === selectedHouseId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function handleOpenCodePrompt(actionType) {
    if (isScanning) return;

    const username = usernameInput.value.trim();
    if (!username) {
      usernameInput.style.borderColor = '#ef4444';
      usernameInput.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.35)';
      usernameInput.placeholder = '⚠️ Vui lòng nhập tên tài khoản game tại đây!';
      usernameInput.focus();
      setTimeout(() => {
        usernameInput.style.borderColor = '';
        usernameInput.style.boxShadow = '';
      }, 2500);
      return;
    }

    if (!selectedHouseId) {
      selectedHouseId = 'llwin';
      updateActiveBannerSelection();
    }

    currentActionType = actionType;
    codeInput.value = '';
    codeModalError.style.display = 'none';
    codeModalError.textContent = '';
    codeModalOverlay.style.display = 'flex';
    setTimeout(() => codeInput.focus(), 50);
  }

  function closeCodeModal() {
    codeModalOverlay.style.display = 'none';
    codeInput.value = '';
    codeModalError.style.display = 'none';
  }

  // Close modal on click backdrop
  codeModalOverlay.addEventListener('click', (e) => {
    if (e.target === codeModalOverlay) {
      closeCodeModal();
    }
  });

  resultModalOverlay.addEventListener('click', (e) => {
    if (e.target === resultModalOverlay) {
      resultModalOverlay.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCodeModal();
      resultModalOverlay.style.display = 'none';
    }
  });

  async function handleVerifyAndRun() {
    const username = usernameInput.value.trim();
    const code = codeInput.value.trim().toUpperCase();

    if (!code) {
      showCodeModalError('Vui lòng nhập mã xác thực!');
      return;
    }

    try {
      // Verify code against server database (with real-time cross-device sync)
      const result = await window.db.verifyAndConsumeCodeAsync(code, username);

      // Close code prompt modal
      closeCodeModal();

      // Trigger Hacker Terminal Scanning Simulation
      runHackerScan(username, result.status);
    } catch (err) {
      showCodeModalError(err.message);
    }
  }

  function showCodeModalError(msg) {
    codeModalError.textContent = msg;
    codeModalError.style.display = 'block';
  }

  async function runHackerScan(username, codeStatus) {
    isScanning = true;
    hackerOverlay.style.display = 'flex';
    hackerBody.innerHTML = '';
    hackerProgressBar.style.width = '0%';
    hackerProgressText.textContent = '0%';

    const currentHouse = window.db.getBanners().find(b => b.id === selectedHouseId) || { name: 'LLWIN' };

    // Scan steps sequence
    const scanSteps = [
      `INIT :: USERNAME = [${username}]`,
      `TARGET :: BOOKMAKER = [${currentHouse.name.toUpperCase()}]`,
      `CONNECT :: PROTOCOL = SSL/TLS ENCRYPTED PROXY`,
      `SCAN :: SECURITY FIREWALL + IP TRACKER DETECTED`,
      `AUTH :: VERIFYING SYSTEM LICENSE PERMISSION [GRANTED]`,
      `PATCH :: DISABLE SYSTEM IP MONITORING & TRACKING ENGINE`,
      `INJECT :: FORCE MAX WIN RATE RTP & ALGORITHM SYNC`,
      `BOOST :: UNLOCK SCATTER & BIGWIN FREQUENCY (SLOT + BCR)`,
      `VERIFY :: SYSTEM BYPASS INTEGRITY CHECK`,
      `CLEAN :: EXECUTE RESIDUAL HIDDEN CODE REMOVAL`,
      `DONE :: PROCESS COMPLETED SUCCESSFULLY`
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      const line = document.createElement('div');
      line.className = 'hacker-line';
      line.textContent = scanSteps[i];
      hackerBody.appendChild(line);
      hackerBody.scrollTop = hackerBody.scrollHeight;

      const progress = Math.round(((i + 1) / scanSteps.length) * 100);
      hackerProgressBar.style.width = `${progress}%`;
      hackerProgressText.textContent = `${progress}%`;

      await delay(280);
    }

    await delay(350);
    hackerOverlay.style.display = 'none';
    isScanning = false;

    // Show Result Popup based on codeStatus
    showFinalResultModal(username, codeStatus);
  }

  function showFinalResultModal(username, status) {
    const config = window.db.getConfig();
    const targetLink = config.defaultHouseLink || 'https://www.07llwin.com/?id=832516623';
    const supportLink = config.supportTelegram || 'https://t.me/XoaMaNhaCai';

    resultModalCard.className = 'result-modal';
    resultActionArea.innerHTML = '';

    if (status === 'SAFE') {
      // Mã an toàn
      resultModalCard.classList.add('modal-safe');
      resultTitle.className = 'result-status success';
      resultTitle.innerHTML = '🛡️ Xoá Mã Ẩn Thành Công!';

      resultText.innerHTML = `
🔰 <strong>Tài khoản:</strong> ${username}

🔵 <strong>Mã ẩn đã được loại bỏ thành công 100%.</strong>
✅ Chế độ theo dõi IP của hệ thống game đã được tắt hoàn toàn.
✅ Tài khoản đã được thiết lập cơ hội nhận <strong>MAX WIN HŨ</strong> trong 1000 lượt quay đầu.
✅ Tính năng <strong>BIG WIN và SCATTER</strong> đã được kích hoạt tối đa.
✅ Loại bỏ soi cầu BCR mọi sảnh, tối đa hóa tỷ lệ chiến thắng!

💎 <em>Chúc bạn gặp nhiều may mắn và thắng lớn!</em>`;

      // Add Direct LLwin button
      const btnPlayLLWin = document.createElement('a');
      btnPlayLLWin.href = targetLink;
      btnPlayLLWin.target = '_blank';
      btnPlayLLWin.rel = 'noopener noreferrer';
      btnPlayLLWin.className = 'btn-close btn-modal-llwin';
      btnPlayLLWin.innerHTML = `
        <span style="font-size: 1.15rem; line-height: 1;">🔥</span>
        <span style="text-align: center;">ĐĂNG KÝ / VÀO CHƠI TẠI LLwin NGAY (LINK CHÍNH THỨC)</span>
      `;

      resultActionArea.appendChild(btnPlayLLWin);
    } else {
      // Dính mã ẩn (INFECTED)
      resultModalCard.classList.add('modal-infected');
      resultTitle.className = 'result-status error danger-alarm';
      resultTitle.innerHTML = '<span class="danger-siren">🚨</span> <span class="danger-title-text">CẢNH BÁO: DÍNH MÃ IP ĐỘC HẠI!</span>';

      resultText.innerHTML = `
<div class="infected-popup-content">
  <div class="infected-user-row">
    <span class="infected-user-icon">🛑</span>
    <span><strong>Tài khoản:</strong> <span class="infected-username">${username}</span></span>
  </div>

  <div class="infected-danger-card">
    <div class="danger-card-header">
      <span class="danger-icon-blink">⚠️</span>
      <span class="danger-card-title">PHÁT HIỆN DẤU HIỆU ĐỘC HẠI</span>
    </div>
    <div class="danger-card-body">
      Tài khoản của bạn vừa được phát hiện có dấu hiệu liên quan đến <span class="text-highlight-danger">địa chỉ IP đáng ngờ/mã IP độc hại</span>. Hãy xóa địa chỉ IP bất thường khỏi tài khoản càng sớm càng tốt để tránh nguy cơ <span class="text-highlight-danger">truy cập trái phép</span>.
    </div>
  </div>

  <div class="infected-benefit-card">
    <div class="benefit-card-header">
      <span class="benefit-icon">⚡</span>
      <span class="benefit-card-title">QUYỀN LỢI SAU KHI XỬ LÝ SẠCH:</span>
    </div>
    <div class="benefit-card-body">
      Sau khi xóa sạch mã ẩn sẽ được kích hoạt toàn bộ tính năng : <strong class="text-highlight-gold">BIG WIN</strong>, <strong class="text-highlight-gold">SCATTER</strong> và <strong class="text-highlight-gold">loại bỏ soi BCR</strong> mọi sảnh game.
    </div>
  </div>

  <div class="infected-cta-card">
    <span class="cta-icon">💎</span>
    <span class="cta-text">Vui lòng liên hệ Admin để được hỗ trợ xóa IP mạng ngay !</span>
  </div>
</div>`;

      // Add Support Button
      const btnSupport = document.createElement('a');
      btnSupport.href = supportLink;
      btnSupport.target = '_blank';
      btnSupport.rel = 'noopener noreferrer';
      btnSupport.className = 'btn-close btn-modal-urgent-support';
      btnSupport.innerHTML = `
        <span class="urgent-btn-fire">🚨</span>
        <span>LIÊN HỆ ADMIN XÓA IP MẠNG NGAY</span>
        <span class="urgent-btn-arrow">⚡</span>
      `;

      resultActionArea.appendChild(btnSupport);
    }

    resultModalOverlay.style.display = 'flex';
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
