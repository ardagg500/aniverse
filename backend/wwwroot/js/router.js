/* ======================================================
   AniVerse - SPA Router Logic
   ====================================================== */

let homeTemplate = '';
let mainContent = null;

document.addEventListener('DOMContentLoaded', () => {
  mainContent = document.getElementById('main-content');
  if (mainContent) {
    homeTemplate = mainContent.innerHTML;
    // Add CSS transition for fading
    mainContent.style.transition = 'opacity 0.3s ease';
  }

  // Handle initial route on page load if coming from another page
  if (mainContent) {
    const urlParams = new URLSearchParams(window.location.search);
    const initialRoute = urlParams.get('route');
    if (initialRoute && initialRoute !== 'home') {
      const btn = document.querySelector(`[data-route="${initialRoute}"]`);
      if (btn) btn.click();
    }
  }
});

document.addEventListener('click', function(e) {
  const sidebarLink = e.target.closest('.sidebar a') || e.target.closest('.sidebar button') || e.target.closest('[data-route]');
  
  if (sidebarLink) {
    const href = sidebarLink.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('index.html?route=')) {
      if (!mainContent || !href.includes('index.html')) {
        return; // Standart tarayıcı sayfa geçişini engelleme
      }
    }
    e.preventDefault();
    const route = sidebarLink.getAttribute('data-route') || sidebarLink.id;
    console.log("Navigasyon tetiklendi, Hedef:", route);
    
    if (typeof handleNavigation === 'function') {
      handleNavigation(route, sidebarLink);
    }
  }
});

function handleNavigation(route, routeBtn) {
  // If we are on a page without mainContent (like watch.html), redirect to index.html with param
  if (!mainContent) {
    window.location.href = `index.html?route=${route}`;
    return;
  }
  
  // Update active state in sidebar
  document.querySelectorAll('.sidebar-icon').forEach(icon => icon.classList.remove('active'));
  if (routeBtn) {
    routeBtn.classList.add('active');
  } else {
    const btn = document.querySelector(`[data-route="${route}"]`);
    if (btn) btn.classList.add('active');
  }
  
  // Route Switcher
  mainContent.style.opacity = 0; // Fade out
  
  setTimeout(() => {
    switch(route) {
      case 'home':
        mainContent.innerHTML = homeTemplate;
        if (typeof renderHero === 'function') {
          renderHero();
          renderContinueWatching();
          renderPopularWeekly();
          renderNewEpisodes();
        }
        break;
      case 'search':
        renderSearchPage(mainContent);
        break;
      case 'calendar':
        renderCalendarPage(mainContent);
        break;
      case 'watchlist':
        renderWatchlistPage(mainContent);
        break;
      case 'speedtest':
        renderSpeedTestPage(mainContent);
        break;
      case 'settings':
        renderSettingsPage(mainContent);
        break;
      default:
        mainContent.innerHTML = '<h2 class="text-center mt-10">Bölüm Yapım Aşamasında</h2>';
    }
    mainContent.style.opacity = 1; // Fade in
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

// 🌟 Render Views 🌟

function renderSearchPage(container) {
  let html = `
    <div class="container section" style="padding-top: 50px; min-height: 80vh;">
      <h1 class="text-3xl font-bold mb-6 text-center">Gelişmiş Arama</h1>
      
      <div style="display: flex; flex-direction: column; align-items: center; gap: 24px; margin-bottom: 40px;">
        <!-- Search Input -->
        <input type="text" placeholder="Anime adı, stüdyo veya karakter ara..." style="width: 100%; max-width: 600px; padding: 15px 20px; border-radius: 30px; border: 1px solid rgba(255,51,68,0.3); background: rgba(0,0,0,0.5); color: white; font-size: 1.1rem; box-shadow: 0 0 15px rgba(255,51,68,0.1); outline: none;">
        
        <!-- Genre Badges -->
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <span class="badge badge-primary" style="cursor: pointer;">Aksiyon</span>
          <span class="badge badge-secondary" style="cursor: pointer;">Fantastik</span>
          <span class="badge badge-secondary" style="cursor: pointer;">Bilim Kurgu</span>
          <span class="badge badge-secondary" style="cursor: pointer;">Romantizm</span>
          <span class="badge badge-warning" style="cursor: pointer;">+18 Dark</span>
        </div>
      </div>
      
      <div class="grid grid-auto-fill" style="margin-top: 40px;">
  `;
  
  // Render top 12 anime for demo
  if (typeof ANIME_DATA !== 'undefined') {
    ANIME_DATA.slice(0, 12).forEach(anime => {
      html += Components.renderAnimeCard(anime);
    });
  }
  
  html += `</div></div>`;
  container.innerHTML = html;
}

function renderCalendarPage(container) {
  let html = `
    <div class="container section" style="padding-top: 50px; min-height: 80vh;">
      <h1 class="text-3xl font-bold mb-8 text-center text-accent" style="text-shadow: 0 0 15px rgba(255,51,68,0.5);">Haftalık Yayın Takvimi</h1>
      <p class="text-secondary text-center mb-8" style="margin-top:-15px;">Tüm animelerin güncel yayın gün ve saatleri.</p>
      <div class="grid gap-6" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
  `;
  
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const allAnimes = typeof ANIME_DATA !== 'undefined' ? ANIME_DATA : [];
  
  days.forEach((day, dIdx) => {
    const dayAnimes = allAnimes.filter((a, idx) => (a.releaseDay === day) || (idx % 7 === dIdx))
      .sort((a, b) => {
        const tA = a.releaseTime || `${18 + (a.id % 5)}:00`;
        const tB = b.releaseTime || `${18 + (b.id % 5)}:00`;
        return tA.localeCompare(tB);
      });
      
    html += `
      <div class="glass p-6" style="border-top: 3px solid #ff3344; background: rgba(18,18,22,0.7); border-radius: 14px; padding: 20px;">
        <h2 class="text-xl font-bold mb-4" style="color:#ff3344; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">📅 ${day}</h2>
        <div class="flex flex-col gap-3" style="display:flex; flex-direction:column; gap:12px;">
    `;
    
    dayAnimes.forEach(anime => {
      const epNum = anime.episodes && anime.episodes.length > 0 ? anime.episodes.length : anime.totalEpisodes || 1;
      const time = anime.releaseTime || `${18 + (anime.id % 5)}:00`;
      const genresStr = Array.isArray(anime.genres) ? anime.genres.slice(0, 2).join(', ') : 'Aksiyon';
      
      html += `
        <a href="watch.html?id=${anime.id}&ep=1" class="flex gap-4 items-center p-3 hover-lift" style="display:flex; gap:12px; align-items:center; padding:10px; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius: 10px; text-decoration:none; transition:all 0.2s;">
          <img src="${anime.image || anime.banner}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; flex-shrink:0;">
          <div style="flex:1; overflow:hidden;">
            <div class="font-bold text-white" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.95rem;">${anime.title}</div>
            <div class="text-xs text-secondary mt-1">🏷️ ${genresStr}</div>
            <div class="text-sm font-semibold mt-1" style="color:#ff3344;">⏰ ${time} — Bölüm ${epNum}</div>
          </div>
        </a>
      `;
    });
    
    html += `</div></div>`;
  });
  
  html += `</div></div>`;
  container.innerHTML = html;
}

function renderWatchlistPage(container) {
  const watchlist = typeof Utils !== 'undefined' ? Utils.getWatchlist() : [];
  
  let html = `
    <div class="container section" style="padding-top: 50px; min-height: 80vh;">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Koleksiyonum</h1>
        <div class="badge badge-primary">${watchlist.length} Anime</div>
      </div>
      <div class="grid grid-auto-fill">
  `;
  
  if (watchlist.length > 0) {
    watchlist.forEach(id => {
      const anime = typeof Utils !== 'undefined' ? Utils.getAnimeById(id) : null;
      if (anime) html += Components.renderAnimeCard(anime);
    });
  } else {
    html += `<div class="text-center w-full mt-10 text-secondary text-xl">HenÃ¼z listene anime eklemedin.</div>`;
  }
  
  html += `</div></div>`;
  container.innerHTML = html;
}

function renderSettingsPage(container) {
  const currentUserRaw = localStorage.getItem('aniverse_currentUser');
  let user = currentUserRaw ? JSON.parse(currentUserRaw) : { username: "Misafir", email: "misafir@aniverse.com", initial: "M" };
  
  if (user && !user.initial && user.username) {
    user.initial = user.username.charAt(0).toUpperCase();
  }
  const userEmail = user.email || `${user.username ? user.username.toLowerCase() : 'kullanici'}@aniverse.io`;
  
  let html = `
    <style>
      .cyber-switch { position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0; }
      .cyber-switch input { opacity: 0; width: 0; height: 0; }
      .cyber-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.08); transition: .3s; border-radius: 34px; border: 1px solid rgba(255,255,255,0.15); }
      .cyber-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: #fff; transition: .3s; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.5); }
      .cyber-switch input:checked + .cyber-slider { background-color: #ff3344; border-color: #ff3344; box-shadow: 0 0 12px rgba(255,51,68,0.5); }
      .cyber-switch input:checked + .cyber-slider:before { transform: translateX(24px); }
      .cyber-input { background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); color: white; padding: 12px 16px; border-radius: 10px; width: 100%; outline: none; transition: all 0.3s; font-family: inherit; font-size:0.95rem; }
      .cyber-input:focus { border-color: #ff3344; box-shadow: 0 0 15px rgba(255,51,68,0.25); }
      .cyber-card { background: rgba(18, 18, 24, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 28px; margin-bottom: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    </style>
    
    <div class="container section page-enter" style="padding-top: 40px; min-height: 80vh; max-width: 820px; margin: 0 auto;">
      <h1 class="text-3xl font-bold mb-2 text-center" style="font-family: var(--font-display); letter-spacing:-1px;">HESAP & AYARLAR</h1>
      <p class="text-secondary text-center mb-8">Siberpunk profil ve bildirim tercihlerinizi özelleştirin.</p>
      
      <!-- Profile & Email Update Card -->
      <div class="cyber-card" style="border-left: 4px solid #ff3344;">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2" style="color:#ff3344;">⚡ Kimlik & E-posta</h2>
        <div class="flex items-center gap-6 mb-6 flex-wrap">
          <div style="width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, #ff3344, #990011); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: bold; border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 0 20px rgba(255,51,68,0.5); flex-shrink: 0;">
            ${user.initial}
          </div>
          <div style="flex: 1; min-width: 200px;">
            <div style="font-size: 1.4rem; font-weight: 800; color: #fff;">${user.username}</div>
            <div class="badge badge-primary mt-1" style="display:inline-block; font-size:0.75rem; padding: 3px 10px;">CYBER VIP ÜYE</div>
          </div>
        </div>
        
        <form onsubmit="event.preventDefault(); alert('E-posta başarıyla güncellendi!');" style="display:flex; gap:12px; flex-wrap:wrap; margin-top:20px;">
          <div style="flex:1; min-width:260px;">
            <label class="text-xs text-secondary mb-2 block font-semibold uppercase tracking-wider">E-posta Adresi</label>
            <input type="email" class="cyber-input" value="${userEmail}" required placeholder="adiniz@aniverse.com">
          </div>
          <div style="display:flex; align-items:flex-end;">
            <button type="submit" class="btn btn-primary" style="padding: 12px 24px; height:46px; white-space:nowrap;">E-postayı Kaydet</button>
          </div>
        </form>
      </div>
      
      <!-- Password Change Card -->
      <div class="cyber-card">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2" style="color:#fff;">🔐 Güvenlik & Şifre Değiştir</h2>
        <form onsubmit="event.preventDefault(); const p1=this.newp.value; const p2=this.rep.value; if(p1!==p2){alert('Yeni şifreler eşleşmiyor!'); return;} alert('Şifreniz güvenli şekilde güncellendi!'); this.reset();" style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label class="text-xs text-secondary mb-1 block font-semibold">Mevcut Şifre</label>
            <input type="password" class="cyber-input" required placeholder="••••••••">
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
            <div>
              <label class="text-xs text-secondary mb-1 block font-semibold">Yeni Şifre</label>
              <input type="password" name="newp" class="cyber-input" required placeholder="Yeni şifreniz (En az 6 karakter)" minlength="6">
            </div>
            <div>
              <label class="text-xs text-secondary mb-1 block font-semibold">Yeni Şifre Tekrar</label>
              <input type="password" name="rep" class="cyber-input" required placeholder="Yeni şifrenizi doğrulayın" minlength="6">
            </div>
          </div>
          <div style="text-align:right; margin-top:8px;">
            <button type="submit" class="btn btn-secondary" style="border:1px solid #ff3344; color:#ff3344; background:transparent;">Şifreyi Güncelle</button>
          </div>
        </form>
      </div>
      
      <!-- Preferences & Switches Card -->
      <div class="cyber-card">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2" style="color:#fff;">⚙️ Bildirim & Sistem Tercihleri</h2>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:16px;">
          <div>
            <div class="font-bold text-white">E-posta Bülteni & Bildirimleri</div>
            <div class="text-xs text-secondary mt-1">Yeni çıkan animeler ve bölüm duyurularını e-posta ile al</div>
          </div>
          <label class="cyber-switch">
            <input type="checkbox" checked onchange="Utils && Utils.showToast ? Utils.showToast('Tercih kaydedildi') : null">
            <span class="cyber-slider"></span>
          </label>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:16px;">
          <div>
            <div class="font-bold text-white">Anlık Tarayıcı Bildirimleri (Push)</div>
            <div class="text-xs text-secondary mt-1">Takip ettiğim serinin yeni bölümü yüklendiğinde masaüstü bildirimi gönder</div>
          </div>
          <label class="cyber-switch">
            <input type="checkbox" checked onchange="Utils && Utils.showToast ? Utils.showToast('Bildirim izni güncellendi') : null">
            <span class="cyber-slider"></span>
          </label>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:16px;">
          <div>
            <div class="font-bold text-white">Arayüz Dili (Language)</div>
            <div class="text-xs text-secondary mt-1">Sistem ve altyazı öncelikli dil seçimi</div>
          </div>
          <select class="cyber-input" style="width: 140px; padding: 8px 12px; cursor:pointer;" onchange="alert('Dil seçimi değiştirildi: ' + this.value)">
            <option value="tr">🇹🇷 Türkçe (TR)</option>
            <option value="en">🇺🇸 English (EN)</option>
            <option value="jp">🇯🇵 日本語 (JP)</option>
          </select>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div class="font-bold text-white">Sinema Oynatma Modu</div>
            <div class="text-xs text-secondary mt-1">Bölüm bittiğinde sonraki bölüme otomatik geç ve ışıkları kıs</div>
          </div>
          <label class="cyber-switch">
            <input type="checkbox" checked>
            <span class="cyber-slider"></span>
          </label>
        </div>
        
      </div>
      
    </div>
  `;
  container.innerHTML = html;
}

function renderSpeedTestPage(container) {
  let html = `
    <style>
      .cyber-speed-card { max-width: 720px; width: 100%; margin: 0 auto; background: rgba(16, 16, 22, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 42, 59, 0.3); border-radius: 24px; padding: 45px 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(255, 42, 59, 0.08); text-align: center; position: relative; overflow: hidden; }
      .cyber-speed-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, transparent, #ff2a3b, transparent); box-shadow: 0 0 25px rgba(255, 42, 59, 0.65); }
      .gauge-wrapper { position: relative; width: 280px; height: 160px; margin: 40px auto 20px; }
      .gauge-svg { width: 100%; height: 100%; overflow: visible; }
      .gauge-bg { fill: none; stroke: rgba(255, 255, 255, 0.08); stroke-width: 16; stroke-linecap: round; }
      .gauge-bar { fill: none; stroke: #ff2a3b; stroke-width: 16; stroke-linecap: round; stroke-dasharray: 439.8; stroke-dashoffset: 439.8; transition: stroke-dashoffset 0.15s; filter: drop-shadow(0 0 10px rgba(255, 42, 59, 0.8)); }
      .gauge-needle { transform-origin: 140px 140px; transform: rotate(-90deg); transition: transform 0.15s; filter: drop-shadow(0 0 8px #ff2a3b); }
      .speed-readout { position: absolute; bottom: -15px; left: 0; right: 0; text-align: center; }
      .speed-number { font-family: var(--font-display, 'Outfit', sans-serif); font-size: 4rem; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(255, 42, 59, 0.6); line-height: 1; }
      .btn-cyber-test { background: linear-gradient(135deg, #ff2a3b, #a00014); color: white; border: 1px solid #ff5564; border-radius: 14px; padding: 16px 40px; font-size: 1.15rem; font-weight: 800; letter-spacing: 1px; cursor: pointer; box-shadow: 0 0 25px rgba(255, 42, 59, 0.45); transition: all 0.3s; display: inline-flex; align-items: center; gap: 10px; margin-top: 30px; }
      .btn-cyber-test:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 0 40px rgba(255, 42, 59, 0.8); }
    </style>
    
    <div class="container section page-enter" style="padding-top: 50px; min-height: 80vh;">
      <div class="cyber-speed-card">
        <div class="badge badge-primary mb-3" style="background:rgba(255,42,59,0.15); color:#ff2a3b; border:1px solid rgba(255,42,59,0.4);">SİBERPUNK AĞ ANALİZİ</div>
        <h1 class="text-3xl font-bold text-white mb-2" style="font-family:var(--font-display); letter-spacing:-1px;">NEON BAĞLANTI & HIZ TESTİ</h1>
        <p class="text-secondary text-sm">Sunucularımızla aranızdaki gecikme ve bant genişliğini saniyeler içinde analiz edin.</p>
        
        <div class="gauge-wrapper">
          <svg class="gauge-svg" viewBox="0 0 280 150">
            <path class="gauge-bg" d="M 20 140 A 120 120 0 0 1 260 140" />
            <path class="gauge-bar" id="spa-gauge-bar" d="M 20 140 A 120 120 0 0 1 260 140" />
            <g class="gauge-needle" id="spa-gauge-needle">
              <polygon points="137,140 143,140 140,25" fill="#ffffff" />
              <circle cx="140" cy="140" r="10" fill="#ff2a3b" stroke="#ffffff" stroke-width="3" />
            </g>
          </svg>
          <div class="speed-readout">
            <div class="speed-number" id="spa-speed-val">0.0</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #ff2a3b; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Mbps İndirme</div>
          </div>
        </div>
        
        <div id="spa-rec-box" style="margin-top: 35px; padding: 20px; background: rgba(255, 42, 59, 0.08); border: 1px dashed rgba(255, 42, 59, 0.4); border-radius: 16px; display: none;">
          <div class="text-xs text-secondary uppercase tracking-widest font-bold mb-1">YAYIN KALİTESİ TAVSİYESİ</div>
          <div class="text-xl font-extrabold text-white" id="spa-rec-text">🔥 4K Ultra HD Kesintisiz İzlenebilir</div>
          <div class="text-xs mt-2" style="color: #ff808b;">Gecikme (Ping): 11ms — Jitter: 1.2ms</div>
        </div>
        
        <button class="btn-cyber-test" id="spa-start-btn">
          <span>⚡ TESTİ BAŞLAT</span>
        </button>
      </div>
    </div>
  `;
  container.innerHTML = html;
  
  const startBtn = document.getElementById('spa-start-btn');
  const valEl = document.getElementById('spa-speed-val');
  const barEl = document.getElementById('spa-gauge-bar');
  const needleEl = document.getElementById('spa-gauge-needle');
  const recBox = document.getElementById('spa-rec-box');
  const recText = document.getElementById('spa-rec-text');
  
  if (startBtn) {
    let isTesting = false;
    startBtn.addEventListener('click', () => {
      if (isTesting) return;
      isTesting = true;
      startBtn.disabled = true;
      startBtn.innerHTML = '<span>⏳ ÖLÇÜLÜYOR...</span>';
      recBox.style.display = 'none';
      
      const targetSpeed = Math.floor(Math.random() * 95) + 45 + Math.round(Math.random()*10)/10;
      let startTime = null;
      const duration = 3000;
      
      function anim(timestamp) {
        if (!startTime) startTime = timestamp;
        const p = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const jitter = p < 1 ? (Math.random() - 0.5) * 8 : 0;
        const cur = Math.max(0, targetSpeed * ease + jitter);
        
        const angle = Math.min(Math.max(-90, -90 + (cur / 150) * 180), 90);
        needleEl.style.transform = `rotate(${angle}deg)`;
        barEl.style.strokeDashoffset = Math.max(0, 439.8 - (cur / 150) * 439.8);
        valEl.textContent = cur.toFixed(1);
        
        if (p < 1) {
          requestAnimationFrame(anim);
        } else {
          valEl.textContent = targetSpeed.toFixed(1);
          isTesting = false;
          startBtn.disabled = false;
          startBtn.innerHTML = '<span>🔄 YENİDEN TEST ET</span>';
          if (targetSpeed >= 60) recText.innerHTML = '🔥 4K Ultra HD + HDR (Kesintisiz & Tam Akıcı)';
          else if (targetSpeed >= 25) recText.innerHTML = '⚡ 1080p Full HD 60FPS (Kesintisiz İzlenebilir)';
          else recText.innerHTML = '📺 720p HD (Akıcı İzleme Deneyimi)';
          recBox.style.display = 'block';
        }
      }
      requestAnimationFrame(anim);
    });
  }
}

document.addEventListener('click', e => console.log('Tıklanan element:', e.target), true);

