/* ======================================================
   AniVerse — Component Templates
   ====================================================== */

const Components = {

  // ── Navbar ──
  renderNavbar() {
    const currentPath = window.location.pathname;
    
    // Check Auth State
    const currentUserRaw = localStorage.getItem('aniverse_currentUser');
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
    
    let userHtml = '';
    if (currentUser) {
      const initChar = currentUser.initial || (currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U');
      const avatarSvg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#ff3344"/><text x="50" y="56" font-family="Arial, sans-serif" font-weight="bold" font-size="46" fill="white" text-anchor="middle">${initChar}</text></svg>`);
      userHtml = `
        <a href="profile.html" class="nav-profile-btn" aria-label="Profil" title="${currentUser.username}" style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; overflow:hidden; border:2px solid #ff3344; box-shadow:0 0 10px rgba(255,51,68,0.4); text-decoration:none; background:#ff3344;">
          <img src="data:image/svg+xml;utf8,${avatarSvg}" alt="${currentUser.username}" style="width:100%; height:100%; object-fit:cover;" onerror="this.outerHTML='<span style=\\'color:white;font-weight:bold;font-size:1.1rem;\\'>${initChar}</span>'">
        </a>
        <button onclick="localStorage.removeItem('aniverse_currentUser'); localStorage.removeItem('isLoggedIn'); window.location.reload();" title="Çıkış Yap" style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 5px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      `;
    } else {
      userHtml = `
        <a href="auth.html" style="background: rgba(255, 51, 68, 0.1); color: #ff3344; border: 1px solid rgba(255, 51, 68, 0.3); border-radius: 8px; padding: 8px 16px; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 0 10px rgba(255,51,68,0.1);" onmouseover="this.style.background='#ff3344'; this.style.color='white'; this.style.boxShadow='0 0 15px rgba(255,51,68,0.5)';" onmouseout="this.style.background='rgba(255, 51, 68, 0.1)'; this.style.color='#ff3344'; this.style.boxShadow='0 0 10px rgba(255,51,68,0.1)';">Giriş Yap</a>
      `;
    }

    return `
      <nav class="navbar" id="navbar">
        <a href="index.html" class="navbar-brand">
          <div class="brand-icon" style="background: transparent; box-shadow: none; width: 40px; height: 40px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" style="width: 100%; height: 100%; filter: drop-shadow(0px 0px 8px rgba(255,51,68,0.8));">
              <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="linear-gradient(135deg, rgba(255,51,68,0.2), transparent)" stroke="#ff3344" stroke-width="2"/>
              <path d="M20,10 L32,30 L25,30 L20,20 L15,30 L8,30 Z" fill="#ffffff"/>
              <path d="M20,24 L24,30 L16,30 Z" fill="#ff3344"/>
            </svg>
          </div>
          <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; letter-spacing: -1px;">
            <span style="color: #ff3344; text-shadow: 0 0 15px rgba(255,51,68,0.5);">Ani</span><span style="color: #fff;">Verse</span>
          </span>
        </a>
        
        <div class="navbar-center">
          <a href="index.html" class="nav-link ${currentPath.includes('index.html') || currentPath === '/' ? 'active' : ''}">Ana Sayfa</a>
          <a href="trending.html" class="nav-link ${currentPath.includes('trending.html') ? 'active' : ''}">Trendler</a>
          <a href="genres.html" class="nav-link ${currentPath.includes('genres.html') ? 'active' : ''}">Türler</a>
          <a href="mobile.html" class="nav-link ${currentPath.includes('mobile.html') ? 'active' : ''}">Mobil Uygulama</a>
          ${localStorage.getItem('userRole') === 'admin' ? `<a href="admin.html" class="nav-link" style="color: #ff3344; text-shadow: 0 0 8px rgba(255,51,68,0.6); font-weight: 700;">Admin Paneli</a>` : ''}
        </div>
        
        <div class="navbar-right">
          <a href="search.html" class="nav-search-btn" aria-label="Ara">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </a>
          ${userHtml}
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menü">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </nav>
      
      <div class="mobile-nav" id="mobile-nav">
        <button class="mobile-nav-close" aria-label="Kapat">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <a href="index.html" class="nav-link">Ana Sayfa</a>
        <a href="search.html" class="nav-link">Keşfet & Ara</a>
        <a href="profile.html" class="nav-link">Profilim</a>
        <a href="trending.html" class="nav-link">Trendler</a>
        <a href="genres.html" class="nav-link">Türler</a>
        <a href="mobile.html" class="nav-link">Mobil Uygulama</a>
      </div>
    `;
  },

  // ── Footer ──
  renderFooter() {
    return `
      <footer class="footer">
        <div class="footer-grid">
          <div class="footer-brand-section">
            <div class="footer-brand" style="font-family: var(--font-display); font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 15px;">
              <span style="color: #ff3344; text-shadow: 0 0 15px rgba(255,51,68,0.5);">Ani</span><span style="color: #fff;">Verse</span>
            </div>
            <p class="footer-desc">
              Yeni nesil anime izleme deneyimi. En sevdiğiniz serileri yüksek kalitede, kesintisiz ve harika bir arayüzle izleyin.
            </p>
          </div>
          
          <div class="footer-col">
            <h4 class="footer-title">Kurumsal</h4>
            <div class="footer-links">
              <a href="#" class="footer-link">Hakkımızda</a>
              <a href="#" class="footer-link">İletişim</a>
              <a href="#" class="footer-link">Kariyer</a>
            </div>
          </div>
          
          <div class="footer-col">
            <h4 class="footer-title">Yasal</h4>
            <div class="footer-links">
              <a href="#" class="footer-link">Kullanım Koşulları</a>
              <a href="#" class="footer-link">Gizlilik Politikası</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 AniVerse. Tüm hakları saklıdır.</p>
          <div class="footer-social">
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" aria-label="Discord">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path><path d="M7 16.5c-2.9 1.5-3 4.5-3 4.5l4-3c1.3.8 2.8 1.3 4 1.5 1.2-.2 2.7-.7 4-1.5l4 3s-.1-3-3-4.5"></path><path d="M22 9c0-4-3-7-6-7-1.5 0-2.5.5-4 1.5C10.5 2.5 9.5 2 8 2 5 2 2 5 2 9c0 5 3 11 10 13 7-2 10-8 10-13z"></path></svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    `;
  },

  // ── Anime Card (Standard) ──
  renderAnimeCard(anime, className = '', rank = null) {
    const isWatchlist = Utils.isInWatchlist(anime.id);
    const coverImage = anime.image || anime.banner || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=900";
      
    return `
      <a href="watch.html?id=${anime.id}" class="anime-card hover-lift ${className}">
        <div class="anime-card-image">
          <img src="${coverImage}" alt="${anime.title}" class="lazy">
          <div class="anime-card-gradient"></div>
          
          ${rank !== null ? `<div class="rank-badge">${rank}</div>` : ''}
          
          <div class="anime-card-rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ${Utils.formatRating(anime.rating)}
          </div>
          
          <div class="anime-card-overlay">
            <div class="play-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        </div>
        
        <div class="anime-card-info">
          <h3 class="anime-card-title">${anime.title}</h3>
          <div class="anime-card-meta">
            <span>${anime.year}</span>
            <span class="dot"></span>
            <span>${anime.status === 'Tamamlandı' ? `${anime.totalEpisodes} Bölüm` : 'Devam Ediyor'}</span>
          </div>
        </div>
      </a>
    `;
  },

  // ── Anime Card (Wide / Continue Watching) ──
  renderContinueWatchingCard(item) {
    const anime = Utils.getAnimeById(item.animeId);
    if (!anime) return '';
    
    const coverImage = anime.banner || anime.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&h=800";

    return `
      <a href="watch.html?id=${anime.id}&ep=${item.episode}" class="anime-card-wide hover-lift">
        <div class="anime-card-wide-image">
          <img src="${coverImage}" alt="${anime.title}" class="lazy">
          <div class="anime-card-overlay">
            <div class="play-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
          <div class="progress-bar-mini">
            <div class="progress-bar-mini-fill" style="width: ${item.progress}%"></div>
          </div>
        </div>
        <div class="anime-card-wide-info">
          <h3 class="anime-card-wide-title">${anime.title}</h3>
          <div class="flex justify-between items-center">
            <span class="anime-card-wide-ep text-accent">Bölüm ${item.episode}</span>
            <span class="anime-card-wide-ep">${item.lastWatched}</span>
          </div>
        </div>
      </a>
    `;
  },

  // ── Mobile App Modal ──
  renderAppModal() {
    return `
      <div class="modal-overlay" id="app-modal">
        <div class="modal-content glass-strong animate-scale-in">
          <button class="modal-close" onclick="document.getElementById('app-modal').classList.remove('active')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div class="modal-header">
            <h2 class="text-2xl font-bold mb-2">AniVerse Cebinizde!</h2>
            <p class="text-secondary">Mobil uygulamamızı indirerek her yerde kesintisiz anime izleme keyfini yaşayın.</p>
          </div>
          <div class="modal-body text-center">
            <div class="flex justify-center gap-4 my-6">
              <a href="#" class="btn btn-secondary flex-col py-4 px-6 hover-lift" style="min-width: 140px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="mb-2"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08zM12.03 7.25C11.5 4.3 14.18 1.9 16.92 2c.4 3.23-2.6 5.6-4.89 5.25z"/></svg>
                <span>App Store'dan</span>
                <strong>İndirin</strong>
              </a>
              <a href="#" class="btn btn-secondary flex-col py-4 px-6 hover-lift" style="min-width: 140px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="mb-2"><path d="M17.523 15.341l2.424 4.198a.428.428 0 01-.157.583.428.428 0 01-.582-.157l-2.457-4.254a10.82 10.82 0 01-9.501 0l-2.458 4.254a.428.428 0 01-.583.157.428.428 0 01-.157-.583l2.424-4.198C3.122 13.565 1.056 10.51 1.01 7.027h21.98c-.046 3.483-2.112 6.538-5.467 8.314zM8.307 9.873c.758 0 1.373-.615 1.373-1.373 0-.758-.615-1.373-1.373-1.373s-1.373.615-1.373 1.373c0 .758.615 1.373 1.373 1.373zm7.386 0c.758 0 1.373-.615 1.373-1.373 0-.758-.615-1.373-1.373-1.373s-1.373.615-1.373 1.373c0 .758.615 1.373 1.373 1.373z"/></svg>
                <span>Google Play'den</span>
                <strong>Edinin</strong>
              </a>
            </div>
            <div class="mt-4 p-4 bg-black bg-opacity-30 rounded-lg">
              <p class="text-sm">Veya telefon kameranızla kodu okutun:</p>
              <div class="mt-2 w-32 h-32 mx-auto bg-white p-2 rounded flex items-center justify-center text-black font-bold">QR KOD BURADA</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 🌟 Inject Layout 🌟
  injectLayout() {
    // Inject Sidebar
    const sidebarContainer = document.createElement('div');
    sidebarContainer.innerHTML = this.renderSidebar();
    document.body.insertBefore(sidebarContainer.firstElementChild, document.body.firstChild);

    // Inject Navbar
    const navContainer = document.createElement('div');
    navContainer.innerHTML = this.renderNavbar();
    document.body.insertBefore(navContainer.firstElementChild, document.body.children[1]);
    
    // Inject Footer
    const footerContainer = document.createElement('div');
    footerContainer.innerHTML = this.renderFooter();
    document.body.appendChild(footerContainer.firstElementChild);
    
    // Initialize Nav scripts
    Utils.initCommon();
  },

  // 🌟 Sidebar 🌟
  renderSidebar() {
    const currentPath = window.location.pathname;
    const isIndex = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/aniverse/');
    const isSearch = currentPath.includes('search.html');
    const isProfile = currentPath.includes('profile.html');
    const isSpeedTest = currentPath.includes('speedtest.html') || currentPath.includes('SpeedTest');
    
    return `
      <aside class="sidebar">
        <div class="sidebar-top">
          <a href="index.html" class="sidebar-icon ${isIndex ? 'active' : ''}" data-route="home" title="Ana Sayfa">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </a>
          <a href="search.html" class="sidebar-icon ${isSearch ? 'active' : ''}" data-route="search" title="Keşfet / Arama">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </a>
          <a href="index.html?route=calendar" class="sidebar-icon" data-route="calendar" title="Yayın Takvimi">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </a>
          <a href="profile.html" class="sidebar-icon ${isProfile ? 'active' : ''}" data-route="watchlist" title="Koleksiyon / Favoriler">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </a>
        </div>
        <div class="sidebar-bottom">
          <a href="speedtest.html" class="sidebar-icon ${isSpeedTest ? 'active' : ''}" data-route="speedtest" title="Hız Testi">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </a>
          <a href="profile.html#tab-settings" class="sidebar-icon" data-route="settings" title="Ayarlar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </a>
        </div>
      </aside>
    `;
  }
};
