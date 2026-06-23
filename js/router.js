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
  // TÄ±klanan eleman veya onun en yakÄ±nÄ±ndaki sidebar linkini bul
  const sidebarLink = e.target.closest('.sidebar a') || e.target.closest('.sidebar button') || e.target.closest('[data-route]');
  
  if (sidebarLink) {
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
      <h1 class="text-3xl font-bold mb-8 text-center text-accent" style="text-shadow: 0 0 15px rgba(255,51,68,0.5);">Yayın Takvimi</h1>
      <div class="grid grid-cols-3 gap-6" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
  `;
  
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  days.forEach((day, index) => {
    let bgImage = typeof ANIME_DATA !== 'undefined' && ANIME_DATA[index % ANIME_DATA.length] ? ANIME_DATA[index % ANIME_DATA.length].image : '';
    let title = typeof ANIME_DATA !== 'undefined' && ANIME_DATA[index % ANIME_DATA.length] ? ANIME_DATA[index % ANIME_DATA.length].title : 'Bilinmiyor';
    
    html += `
      <div class="glass p-6" style="border-top: 3px solid #ff3344;">
        <h2 class="text-xl font-bold mb-4">${day}</h2>
        <div class="flex flex-col gap-4">
          <div class="flex gap-4 items-center p-3" style="background: rgba(255,255,255,0.05); border-radius: 10px;">
            <div style="width: 50px; height: 50px; border-radius: 8px; background: url('${bgImage}') center/cover;"></div>
            <div>
              <div class="font-bold">${title}</div>
              <div class="text-sm text-accent">20:00 - Bölüm ${Math.floor(Math.random() * 12) + 1}</div>
            </div>
          </div>
        </div>
      </div>
    `;
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
  // Use active session data
  const currentUserRaw = localStorage.getItem('aniverse_currentUser');
  let user = currentUserRaw ? JSON.parse(currentUserRaw) : { username: "Misafir", initial: "M" };
  
  if (user && !user.initial && user.username) {
    user.initial = user.username.charAt(0).toUpperCase();
  }
  
  let html = `
    <div class="container section" style="padding-top: 50px; min-height: 80vh; max-width: 800px;">
      <h1 class="text-3xl font-bold mb-8 text-center">Hesap ve Ayarlar</h1>
      
      <div class="glass p-8 mb-8" style="border-left: 4px solid #ff3344;">
        <h2 class="text-xl font-bold mb-4">Profil Bilgileri</h2>
        <div class="flex items-center gap-6 mb-6">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: #ff3344; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; box-shadow: 0 0 20px rgba(255,51,68,0.5);">
            ${user.initial}
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; justify-content: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary);">${user.username}</div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">Premium Üye</div>
          </div>
        </div>
      </div>
      
      <div class="glass p-8">
        <h2 class="text-xl font-bold mb-6">Tercihler</h2>
        
        <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <div class="font-bold">Otomatik Oynatma</div>
            <div class="text-sm text-secondary">Bölüm bittiğinde sıradakini otomatik Başlat</div>
          </div>
          <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: #ff3344;">
        </div>
        
        <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <div class="font-bold">Kalite Seçimi</div>
            <div class="text-sm text-secondary">Varsayılan video çözünürlüğü</div>
          </div>
          <select style="background: rgba(0,0,0,0.5); color: white; padding: 5px 10px; border: 1px solid #ff3344; border-radius: 5px; outline: none;">
            <option>1080p</option>
            <option>720p</option>
            <option>Otomatik</option>
          </select>
        </div>
        
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function renderSpeedTestPage(container) {
  let html = `
    <div class="container section" style="padding-top: 50px; min-height: 80vh; max-width: 600px; text-align: center;">
      <h1 class="text-3xl font-bold mb-4">Hız Testi & Kalite Önerisi</h1>
      <p class="text-secondary mb-8">İnternet hızınızı ölçerek AniVerse'te en iyi hangi kalitede anime izleyebileceğinizi öğrenin.</p>
      
      <div class="glass p-8 mb-8" style="border-radius: 20px; box-shadow: 0 0 30px rgba(255,51,68,0.1);">
        <div class="speedometer" style="position: relative; width: 200px; height: 200px; margin: 0 auto 30px;">
          <svg viewBox="0 0 100 50" style="width: 100%; height: 100%; overflow: visible;">
            <!-- Background Arc -->
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8" stroke-linecap="round" />
            <!-- Foreground Arc (Progress) -->
            <path id="speed-progress" d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#ff3344" stroke-width="8" stroke-linecap="round" stroke-dasharray="125.6" stroke-dashoffset="125.6" style="transition: stroke-dashoffset 0.5s ease-out; filter: drop-shadow(0 0 5px #ff3344);" />
          </svg>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; text-align: center;">
            <div id="speed-value" style="font-size: 3rem; font-weight: 900; line-height: 1;">0</div>
            <div class="text-secondary" style="font-size: 0.9rem; font-weight: 700;">Mbps</div>
          </div>
        </div>
        
        <button id="start-speedtest" class="btn btn-primary" style="padding: 15px 40px; font-size: 1.2rem; border-radius: 30px;">Testi Başlat</button>
      </div>
      
      <div id="speedtest-result" class="glass p-6" style="display: none; border-left: 4px solid #ff3344; text-align: left; animation: fadeInUp 0.5s ease forwards;">
        <h3 class="text-xl font-bold mb-2">Önerilen Çözünürlük: <span id="recommended-quality" class="text-accent" style="text-shadow: 0 0 10px rgba(255,51,68,0.5);">1080p</span></h3>
        <p id="quality-desc" class="text-secondary">İnternet HızÄ±nÄ±z yüksek kaliteli bir deneyim için fazlasÄ±yla yeterli!</p>
      </div>
    </div>
  `;
  container.innerHTML = html;

  const startBtn = document.getElementById('start-speedtest');
  const speedProgress = document.getElementById('speed-progress');
  const speedValue = document.getElementById('speed-value');
  const resultBox = document.getElementById('speedtest-result');
  const recQuality = document.getElementById('recommended-quality');
  const qualDesc = document.getElementById('quality-desc');

  if(startBtn) {
    startBtn.addEventListener('click', async () => {
      startBtn.disabled = true;
      startBtn.textContent = 'Ölçülüyor...';
      startBtn.style.opacity = '0.5';
      resultBox.style.display = 'none';
      speedValue.textContent = "0.0";
      speedProgress.style.strokeDashoffset = "125.6";
      
      // Animasyon için geçici ibre hareketi (dalgalanma efekti)
      let animSpeed = 0;
      let animDirection = 1;
      let animInterval = setInterval(() => {
        animSpeed += 15 * animDirection;
        if(animSpeed > 400) animDirection = -1;
        if(animSpeed < 50) animDirection = 1;
        
        speedValue.textContent = "...";
        const percentage = Math.min(animSpeed / 1000, 1);
        const offset = 125.6 - (125.6 * percentage);
        speedProgress.style.strokeDashoffset = offset;
      }, 50);

      try {
        // 25 MB dummy dosya + Timestamp cache engelleme
        const testUrl = "https://speed.cloudflare.com/__down?bytes=25000000&t=" + Date.now();
        const startTime = performance.now();
        
        const response = await fetch(testUrl);
        if (!response.ok) throw new Error("Sunucu yanıt vermedi");
        
        const blob = await response.blob();
        const endTime = performance.now();
        
        clearInterval(animInterval);
        
        // Hesaplama (Saf JS)
        const durationInSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = blob.size * 8;
        const speedBps = bitsLoaded / durationInSeconds;
        const speedMbps = speedBps / (1024 * 1024);
        
        // UI Güncelleme (Sabitleme)
        speedValue.textContent = speedMbps.toFixed(1);
        const displayPercentage = Math.min(speedMbps / 1000, 1);
        const finalOffset = 125.6 - (125.6 * displayPercentage);
        speedProgress.style.strokeDashoffset = finalOffset;
        
        setTimeout(() => {
          startBtn.disabled = false;
          startBtn.textContent = 'Yeniden Test Et';
          startBtn.style.opacity = '1';
          showResult(speedMbps);
        }, 500);

      } catch (err) {
        clearInterval(animInterval);
        console.error("Speedtest Error:", err);
        speedValue.textContent = "Hata";
        speedProgress.style.strokeDashoffset = "125.6";
        
        // Temiz Hata Mesajı
        startBtn.disabled = false;
        startBtn.textContent = 'Tekrar Dene';
        startBtn.style.opacity = '1';
        alert("Sunucuya baÄŸlanÄ±lamadı, lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
      }
    });
  }

  function showResult(mbps) {
    resultBox.style.display = 'block';
    
    if (mbps >= 25) {
      recQuality.textContent = '4K Ultra HD';
      qualDesc.textContent = "4K Ultra HD için Mükemmel! AniVerse\\'teki tüm içerikleri en yüksek kalitede kesintisiz izleyebilirsiniz.";
      recQuality.style.color = '#ff3344';
    } else if (mbps >= 15) {
      recQuality.textContent = '1080p Full HD';
      qualDesc.textContent = '1080p Full HD Ä°Ã§in İdeal! Akıcı ve yüksek kaliteli bir anime deneyimi sizi bekliyor.';
      recQuality.style.color = '#00e676';
    } else if (mbps >= 5) {
      recQuality.textContent = '720p HD';
      qualDesc.textContent = '720p HD Kalitesi. Stabil bir izleme deneyimi yaşayabilirsiniz.';
      recQuality.style.color = '#ffaa00';
    } else {
      recQuality.textContent = '480p / 360p';
      qualDesc.textContent = 'Düşük Hız. Donma yaşamamak için 480p veya 360p kalitelerini tercih etmelisiniz.';
      recQuality.style.color = '#ff4444';
    }
  }
}

document.addEventListener('click', e => console.log('Tıklanan element:', e.target), true);

