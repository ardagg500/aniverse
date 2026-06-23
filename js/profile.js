/* ======================================================
   AniVerse — User Profile Logic
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Components.injectLayout();
  
  // Render user data
  renderUserProfile();
  
  // Render tabs
  renderWatchlist();
  renderFavorites();
  renderHistory();
  renderStats();
  
  // Setup tabs
  setupTabs();
});

// 🌟 User Profile Render 🌟
function renderUserProfile() {
  // 1. Dinamik Kullanıcı Verisi (Mock Data with LocalStorage fallback)
  const sessionUser = window.Auth ? Auth.getCurrentUser() : (localStorage.getItem('aniverse_currentUser') ? JSON.parse(localStorage.getItem('aniverse_currentUser')) : null);
  
  const currentUser = { 
    username: sessionUser ? sessionUser.username : "DemoKullanici", 
    joinDate: "Ocak 2025",
    initial: sessionUser ? sessionUser.initial : "D"
  };

  // Akıllı Avatar Harfi (Eğer initial yoksa, ismin ilk harfini büyük harf yap)
  const firstLetter = currentUser.username.charAt(0).toUpperCase();

  // 2. Veriyi Ekrana Yazdırma (Dynamic Rendering)
  const usernameEl = document.getElementById('profile-username');
  const dateEl = document.getElementById('profile-date');
  const avatarImg = document.getElementById('profile-avatar-img');

  if (usernameEl) usernameEl.textContent = currentUser.username;
  if (dateEl) dateEl.textContent = currentUser.joinDate;
  
  // Avatar SVG'sini dinamik oluşturma
  if (avatarImg) {
    avatarImg.src = ''; // Fallback'i tetiklemek veya doğrudan atamak için
    avatarImg.setAttribute('onerror', ''); // Önceki onerror'u temizle
    const svgData = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23ff3344'/><text x='100' y='100' font-family='Arial' font-weight='bold' font-size='80' fill='white' text-anchor='middle' dy='.35em'>${firstLetter}</text></svg>`;
    avatarImg.src = svgData;
  }
}

// ── Render ──

function renderWatchlist() {
  const container = document.getElementById('watchlist-grid');
  const countEl = document.getElementById('watchlist-count');
  const list = Utils.getWatchlist();
  
  countEl.textContent = list.length;
  
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📋</div>
        <h3 class="empty-state-title">Listeniz Boş</h3>
        <p class="empty-state-text">İzlemek istediğiniz animeleri listeye ekleyerek burada görebilirsiniz.</p>
        <a href="search.html" class="btn btn-primary mt-6">Anime Keşfet</a>
      </div>
    `;
    return;
  }
  
  let html = '';
  list.forEach((id, index) => {
    const anime = Utils.getAnimeById(id);
    if (anime) {
      html += `
        <div class="reveal-scale delay-${(index % 4) + 1}">
          ${Components.renderAnimeCard(anime)}
        </div>
      `;
    }
  });
  
  container.innerHTML = html;
  Utils.initLazyLoading();
}

function renderFavorites() {
  const container = document.getElementById('favorites-grid');
  const countEl = document.getElementById('favorites-count');
  const list = Utils.getFavorites();
  
  countEl.textContent = list.length;
  
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">❤️</div>
        <h3 class="empty-state-title">Favoriniz Yok</h3>
        <p class="empty-state-text">En sevdiğiniz animeleri favorilere ekleyerek burada görebilirsiniz.</p>
        <a href="search.html" class="btn btn-primary mt-6">Anime Keşfet</a>
      </div>
    `;
    return;
  }
  
  let html = '';
  list.forEach((id, index) => {
    const anime = Utils.getAnimeById(id);
    if (anime) {
      html += `
        <div class="reveal-scale delay-${(index % 4) + 1}">
          ${Components.renderAnimeCard(anime)}
        </div>
      `;
    }
  });
  
  container.innerHTML = html;
  Utils.initLazyLoading();
}

function renderHistory() {
  const container = document.getElementById('history-list');
  const countEl = document.getElementById('history-count');
  const history = Utils.getHistory();
  
  countEl.textContent = history.length;
  
  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🕒</div>
        <h3 class="empty-state-title">Geçmiş Boş</h3>
        <p class="empty-state-text">Henüz hiçbir anime izlemediniz.</p>
        <a href="index.html" class="btn btn-primary mt-6">İzlemeye Başla</a>
      </div>
    `;
    return;
  }
  
  // Group by date
  const grouped = history.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
  
  let html = '';
  
  Object.keys(grouped).forEach(date => {
    html += `
      <div class="history-group">
        <h3 class="history-date">${date}</h3>
        <div class="grid grid-cols-2">
    `;
    
    grouped[date].forEach(item => {
      const anime = Utils.getAnimeById(item.animeId);
      if (anime) {
        const progress = Utils.getProgress(anime.id)?.percentage || 100;
        const timeAgo = Utils.timeAgo(item.timestamp);
        
        html += `
          <a href="watch.html?id=${anime.id}&ep=${item.episode}" class="history-card hover-lift">
            <div class="history-thumb">
              <img data-src="${anime.banner || anime.image}" class="lazy" alt="${anime.title}" onerror="this.style.display='none'; this.parentElement.style.background='${Utils.getFallbackGradient(anime.id)}'">
              <div class="progress-bar-mini">
                <div class="progress-bar-mini-fill" style="width: ${progress}%"></div>
              </div>
            </div>
            <div class="history-info">
              <h4 class="history-title">${anime.title}</h4>
              <div class="history-ep text-accent">Bölüm ${item.episode}</div>
              <div class="history-time">${timeAgo}</div>
            </div>
          </a>
        `;
      }
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  Utils.initLazyLoading();
}

function renderStats() {
  const history = Utils.getHistory();
  const list = Utils.getWatchlist();
  const favs = Utils.getFavorites();
  
  // Calculate total episodes watched
  const totalEps = history.length;
  
  // Calculate approx time (assume 24 mins per ep)
  const totalMins = totalEps * 24;
  const hours = Math.floor(totalMins / 60);
  const days = Math.floor(hours / 24);
  
  let timeStr = `${hours} Saat`;
  if (days > 0) timeStr = `${days} Gün ${hours % 24} Saat`;
  
  // Top Genre
  let topGenre = 'Yok';
  if (history.length > 0) {
    const genreCounts = {};
    history.forEach(h => {
      const anime = Utils.getAnimeById(h.animeId);
      if (anime) {
        anime.genres.forEach(g => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });
    
    if (Object.keys(genreCounts).length > 0) {
      topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
    }
  }
  
  document.getElementById('stat-eps').textContent = totalEps;
  document.getElementById('stat-time').textContent = timeStr;
  document.getElementById('stat-genre').textContent = topGenre;
  document.getElementById('stat-list').textContent = list.length;
}

// ── Tabs ──

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active to clicked
      btn.classList.add('active');
      const targetId = btn.dataset.target;
      document.getElementById(targetId).classList.add('active');
      
      // Update URL hash without scroll
      window.history.replaceState(null, null, `#${targetId}`);
    });
  });
  
  // Check hash on load
  const hash = window.location.hash.slice(1);
  if (hash) {
    const btn = document.querySelector(`.tab-btn[data-target="${hash}"]`);
    if (btn) btn.click();
  }
}
