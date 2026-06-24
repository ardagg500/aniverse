/* ======================================================
   AniVerse — Video Player Controller
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check URL params
  const animeId = parseInt(Utils.getUrlParam('id')) || 1;
  const epNum = parseInt(Utils.getUrlParam('ep')) || 1;
  
  // Verify anime exists
  const anime = Utils.getAnimeById(animeId);
  if (!anime) {
    window.location.href = 'index.html';
    return;
  }
  
  // Verify episode exists
  const episode = anime.episodes.find(e => e.number === epNum) || anime.episodes[0];
  
  // Setup Layout
  Components.injectLayout();
  
  // Render Player Page
  renderPlayerPage(anime, episode);
  
  // Init Player Logic
  initPlayer(anime, episode);
});

// ── Render ──

function renderPlayerPage(anime, episode) {
  // Update Title
  document.title = `${anime.title} - Bölüm ${episode.number} | AniVerse`;
  
  // Check Auth
  const isLoggedIn = !!localStorage.getItem('aniverse_currentUser');
  
  const authOverlay = !isLoggedIn ? `
    <div class="auth-gate-overlay">
      <div class="auth-gate-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary); margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <h3 style="margin-bottom: 10px;">Bu içeriği izlemek için lütfen giriş yapın</h3>
        <a href="auth.html" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">Giriş Yap</a>
      </div>
    </div>
  ` : '';

  const main = document.querySelector('main');
  
  main.innerHTML = `
    <div class="player-main">
      <!-- Player Area -->
      <div class="player-area">
        <div class="player-container" id="video-container">
          ${authOverlay}
          ${isLoggedIn ? (
            episode.embedUrl ? `
              <iframe src="${episode.embedUrl}" frameborder="0" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:20;"></iframe>
            ` : `
            <video id="video-player" src="videos/şimdi_böyle_bir_sitem_var_bu_s.mp4" poster="${anime.banner || anime.image}"></video>
            `
          ) : `
            <!-- Sadece poster göster, video yükleme -->
            <img src="${anime.banner || anime.image}" style="width: 100%; height: 100%; object-fit: cover;" alt="Locked">
          `}
          
          ${isLoggedIn && !episode.embedUrl ? `
          <!-- Subtitle Display -->
          <div class="subtitle-display">
            <div class="subtitle-text" id="subtitle-text" style="display: none;">[Altyazı burada görüntülenecek]</div>
          </div>
          
          <!-- Skip Indicators -->
          <div class="skip-indicator left" id="skip-left">
            <div class="skip-indicator-icon">⏪</div>
            <div class="skip-indicator-text">-10s</div>
          </div>
          <div class="skip-indicator right" id="skip-right">
            <div class="skip-indicator-icon">⏩</div>
            <div class="skip-indicator-text">+10s</div>
          </div>
          
          <!-- Center Play Button (Large) -->
          <button class="player-center-play" id="center-play-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          
          <!-- Overlay Controls -->
          <div class="player-overlay" id="player-controls">
            <!-- Top Bar -->
            <div class="player-top-bar">
              <div>
                <div class="player-anime-title">${anime.title}</div>
                <div class="player-episode-info">Bölüm ${episode.number}: ${episode.title}</div>
              </div>
              <button class="control-btn" onclick="window.history.back()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <!-- Bottom Bar -->
            <div class="player-bottom-bar">
              <!-- Progress -->
              <div class="progress-container" id="progress-container">
                <div class="progress-buffered" id="progress-buffered" style="width: 0%"></div>
                <div class="progress-filled" id="progress-filled" style="width: 0%"></div>
                <div class="progress-thumb" id="progress-thumb"></div>
                <div class="progress-tooltip" id="progress-tooltip">00:00</div>
              </div>
              
              <!-- Controls -->
              <div class="controls-row">
                <div class="controls-left">
                  <button class="control-btn" id="play-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </button>
                  <button class="control-btn" id="rewind-btn" title="10s Geri">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
                  </button>
                  <button class="control-btn" id="forward-btn" title="10s İleri">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>
                  </button>
                  
                  <div class="volume-container">
                    <button class="control-btn" id="mute-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                    <div class="volume-slider-wrap">
                      <input type="range" class="volume-slider" id="volume-slider" min="0" max="1" step="0.05" value="1">
                    </div>
                  </div>
                  
                  <div class="time-display">
                    <span id="current-time">00:00</span> / <span id="duration-time">00:00</span>
                  </div>
                </div>
                
                <div class="controls-right">
                  <!-- Quality -->
                  <div class="quality-menu-wrap">
                    <button class="control-btn" id="quality-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                    <div class="quality-menu" id="quality-menu">
                      <div class="quality-menu-title">Kalite</div>
                      <div class="quality-option active" data-quality="auto">
                        <span>Otomatik</span>
                        <span class="check-icon">✓</span>
                      </div>
                      <div class="quality-option" data-quality="1080">
                        <span>1080p HD</span>
                        <span class="check-icon">✓</span>
                      </div>
                      <div class="quality-option" data-quality="720">
                        <span>720p</span>
                        <span class="check-icon">✓</span>
                      </div>
                      <div class="quality-option" data-quality="480">
                        <span>480p</span>
                        <span class="check-icon">✓</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Subtitles -->
                  <div class="quality-menu-wrap">
                    <button class="control-btn" id="subtitle-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M13 8H7"></path><path d="M17 12H7"></path></svg>
                    </button>
                    <div class="subtitle-settings" id="subtitle-settings">
                      <div class="subtitle-settings-title">Altyazı Ayarları</div>
                      
                      <div class="subtitle-setting-row">
                        <span class="subtitle-setting-label">Dil</span>
                        <select class="glass-select" id="sub-lang">
                          <option value="tr">Türkçe</option>
                          <option value="en">English</option>
                          <option value="none">Kapalı</option>
                        </select>
                      </div>
                      
                      <div class="subtitle-setting-row">
                        <span class="subtitle-setting-label">Boyut</span>
                        <input type="range" class="subtitle-size-slider" id="sub-size" min="12" max="32" value="20">
                      </div>
                    </div>
                  </div>
                  
                  <!-- Fullscreen -->
                  <button class="control-btn" id="fullscreen-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
        
        <!-- Info Section -->
        <div class="anime-info-section">
          <div class="container">
            <div class="anime-info-header">
              <div class="anime-info-poster">
                <img src="${anime.image}" alt="${anime.title}" onerror="this.style.display='none'; this.parentElement.style.background='${Utils.getFallbackGradient(anime.id)}'">
              </div>
              <div class="anime-info-details">
                <h1 class="anime-info-title">${anime.title}</h1>
                <div class="anime-info-title-jp">${anime.titleJp}</div>
                
                <div class="anime-info-genres">
                  ${anime.genres.map(g => `<span class="badge badge-primary">${g}</span>`).join('')}
                </div>
                
                <div class="anime-info-stats">
                  <div class="anime-info-stat">
                    <span class="anime-info-stat-label">Puan</span>
                    <span class="anime-info-stat-value text-warning">★ ${Utils.formatRating(anime.rating)}</span>
                  </div>
                  <div class="anime-info-stat">
                    <span class="anime-info-stat-label">Stüdyo</span>
                    <span class="anime-info-stat-value">${anime.studio}</span>
                  </div>
                  <div class="anime-info-stat">
                    <span class="anime-info-stat-label">Sezon</span>
                    <span class="anime-info-stat-value">${anime.season}</span>
                  </div>
                  <div class="anime-info-stat">
                    <span class="anime-info-stat-label">Durum</span>
                    <span class="anime-info-stat-value">${anime.status}</span>
                  </div>
                </div>
                
                <div class="anime-info-description">
                  ${anime.description}
                </div>
                
                <div class="anime-info-actions">
                  <button class="btn btn-secondary watchlist-btn" data-id="${anime.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${Utils.isInWatchlist(anime.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    ${Utils.isInWatchlist(anime.id) ? 'Listeden Çıkar' : 'Listeye Ekle'}
                  </button>
                  <button class="btn btn-secondary fav-btn" data-id="${anime.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${Utils.isInFavorites(anime.id) ? '#ef4444' : 'none'}" stroke="${Utils.isInFavorites(anime.id) ? '#ef4444' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    Favori
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Episode Sidebar -->
      <div class="episode-sidebar">
        <div class="episode-sidebar-header">
          <div class="episode-sidebar-title">Bölümler</div>
          <div class="episode-sidebar-count">${anime.totalEpisodes} Bölüm</div>
        </div>
        <div class="episode-list">
          ${renderEpisodeList(anime, episode.number)}
        </div>
      </div>
    </div>
  `;
}

function renderEpisodeList(anime, currentEpNumber) {
  return anime.episodes.map(ep => `
    <a href="watch.html?id=${anime.id}&ep=${ep.number}" class="episode-card ${ep.number === currentEpNumber ? 'active' : ''}">
      <div class="episode-card-thumb">
        <img src="${anime.image}" alt="Bölüm ${ep.number}" onerror="this.style.display='none'; this.parentElement.style.background='${Utils.getFallbackGradient(anime.id)}'">
        <div class="episode-card-number">${ep.number}</div>
      </div>
      <div class="episode-card-info">
        <div class="episode-card-ep">Bölüm ${ep.number}</div>
        <div class="episode-card-title" title="${ep.title}">${ep.title}</div>
        <div class="episode-card-duration">${ep.duration}</div>
      </div>
    </a>
  `).join('');
}

// ── Player Logic ──

function initPlayer(anime, currentEpisode) {
  const video = document.getElementById('video-player');
  if (!video) return; // Ignore custom player initialization if iframe is used
  const container = document.getElementById('video-container');
  const controls = document.getElementById('player-controls');
  
  // Controls
  const playBtn = document.getElementById('play-btn');
  const centerPlayBtn = document.getElementById('center-play-btn');
  const muteBtn = document.getElementById('mute-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const rewindBtn = document.getElementById('rewind-btn');
  const forwardBtn = document.getElementById('forward-btn');
  
  // Progress
  const progressContainer = document.getElementById('progress-container');
  const progressFilled = document.getElementById('progress-filled');
  const progressBuffered = document.getElementById('progress-buffered');
  const progressThumb = document.getElementById('progress-thumb');
  const progressTooltip = document.getElementById('progress-tooltip');
  
  // Time
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  
  // State
  let controlsTimeout;
  
  // Icons
  const icons = {
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
    volumeOn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
    volumeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
    fullscreen: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>',
    fullscreenExit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>'
  };
  
  // ── Initialization ──
  
  // Check saved progress
  const savedProgress = Utils.getProgress(anime.id);
  if (savedProgress && savedProgress.episode === currentEpisode.number && savedProgress.currentTime > 5) {
    video.currentTime = savedProgress.currentTime;
    Utils.showToast('Kaldığınız yerden devam ediliyor');
  }
  
  // Auto add to history
  Utils.addToHistory(anime.id, currentEpisode.number);
  
  container.classList.add('paused');
  
  // ── Core Functions ──
  
  function togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  
  function updatePlayIcon() {
    if (video.paused) {
      playBtn.innerHTML = icons.play;
      container.classList.add('paused');
    } else {
      playBtn.innerHTML = icons.pause;
      container.classList.remove('paused');
      hideControlsWithDelay();
    }
  }
  
  function toggleMute() {
    video.muted = !video.muted;
    if (video.muted) {
      volumeSlider.value = 0;
      muteBtn.innerHTML = icons.volumeOff;
    } else {
      volumeSlider.value = video.volume;
      muteBtn.innerHTML = icons.volumeOn;
    }
  }
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.log(err));
      container.classList.add('fullscreen');
      fullscreenBtn.innerHTML = icons.fullscreenExit;
    } else {
      document.exitFullscreen();
      container.classList.remove('fullscreen');
      fullscreenBtn.innerHTML = icons.fullscreen;
    }
  }
  
  function skipTime(seconds) {
    video.currentTime += seconds;
    showSkipIndicator(seconds > 0 ? 'right' : 'left');
    showControls();
  }
  
  function showSkipIndicator(direction) {
    const indicator = document.getElementById(`skip-${direction}`);
    indicator.classList.remove('show');
    void indicator.offsetWidth; // trigger reflow
    indicator.classList.add('show');
    
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 500);
  }
  
  // ── Controls Visibility ──
  
  function showControls() {
    container.classList.add('show-controls');
    document.body.style.cursor = 'default';
    clearTimeout(controlsTimeout);
    if (!video.paused) {
      hideControlsWithDelay();
    }
  }
  
  function hideControlsWithDelay() {
    controlsTimeout = setTimeout(() => {
      if (!video.paused) {
        container.classList.remove('show-controls');
        // Close menus
        document.getElementById('quality-menu').classList.remove('open');
        document.getElementById('subtitle-settings').classList.remove('open');
        
        // Hide cursor only in fullscreen
        if (document.fullscreenElement) {
          document.body.style.cursor = 'none';
        }
      }
    }, 3000);
  }
  
  // ── Progress & Time ──
  
  function updateProgress() {
    if (!video.duration) return;
    
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.width = `${percent}%`;
    progressThumb.style.left = `calc(${percent}% - 7px)`;
    currentTimeEl.textContent = Utils.formatTime(video.currentTime);
    
    // Save progress periodically (every 5 seconds)
    if (Math.floor(video.currentTime) % 5 === 0) {
      Utils.saveProgress(anime.id, currentEpisode.number, video.currentTime, video.duration);
    }
  }
  
  function updateBuffer() {
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percent = (bufferedEnd / video.duration) * 100;
      progressBuffered.style.width = `${percent}%`;
    }
  }
  
  function setProgress(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  }
  
  // ── Next Episode Countdown (Disabled) ──
  
  function showNextEpisodeCountdown() {
    // Disabled as per user request to allow uninterrupted viewing
    return;
  }
  
  function cancelNextEpisodeCountdown() {
    // Disabled
    return;
  }
  
  function goToNextEpisode(epNum) {
    window.location.href = `watch.html?id=${anime.id}&ep=${epNum}`;
  }
  
  // ── Menus ──
  
  function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains('open');
    
    // Close all menus
    document.getElementById('quality-menu').classList.remove('open');
    document.getElementById('subtitle-settings').classList.remove('open');
    
    if (!isOpen) {
      menu.classList.add('open');
    }
  }
  
  // ── Subtitles ──
  
  function toggleSubtitles() {
    const lang = document.getElementById('sub-lang').value;
    const subText = document.getElementById('subtitle-text');
    
    if (lang === 'none') {
      subText.style.display = 'none';
    } else {
      subText.style.display = 'inline-block';
      // In a real app, this would sync with video.currentTime
      subText.textContent = `[Demo ${lang.toUpperCase()}] Bu örnek bir altyazıdır.`;
    }
  }
  
  function changeSubtitleSize() {
    const size = document.getElementById('sub-size').value;
    document.getElementById('subtitle-text').style.fontSize = `${size}px`;
  }
  
  // ── Event Listeners ──
  
  // Video Events
  video.addEventListener('play', updatePlayIcon);
  video.addEventListener('pause', updatePlayIcon);
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('progress', updateBuffer);
  video.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = Utils.formatTime(video.duration);
  });
  video.addEventListener('ended', () => {
    updatePlayIcon();
    showControls();
    // Auto-play disabled
  });
  
  // Click Events
  playBtn.addEventListener('click', togglePlay);
  centerPlayBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  muteBtn.addEventListener('click', toggleMute);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  rewindBtn.addEventListener('click', () => skipTime(-10));
  forwardBtn.addEventListener('click', () => skipTime(10));
  
  // Double Click (Skip)
  container.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      skipTime(10);
    } else {
      skipTime(-10);
    }
  });
  
  // Progress Bar
  let isDragging = false;
  progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    setProgress(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) setProgress(e);
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Progress Hover Tooltip
  progressContainer.addEventListener('mousemove', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * video.duration;
    
    progressTooltip.style.left = `${pos * 100}%`;
    progressTooltip.textContent = Utils.formatTime(time);
  });
  
  // Volume Slider
  volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = e.target.value === '0';
    if (video.muted) {
      muteBtn.innerHTML = icons.volumeOff;
    } else {
      muteBtn.innerHTML = icons.volumeOn;
    }
  });
  
  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if (e.target.tagName.toLowerCase() === 'input') return;
    
    switch(e.code) {
      case 'Space':
      case 'KeyK':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipTime(10);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipTime(-10);
        break;
      case 'KeyF':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'KeyM':
        e.preventDefault();
        toggleMute();
        break;
    }
  });
  
  // Mouse Move (Show Controls)
  container.addEventListener('mousemove', showControls);
  container.addEventListener('mouseleave', () => {
    if (!video.paused) container.classList.remove('show-controls');
  });
  
  // Menus
  document.getElementById('quality-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu('quality-menu');
  });
  
  document.getElementById('subtitle-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu('subtitle-settings');
  });
  
  // Quality Selection
  document.querySelectorAll('.quality-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.quality-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      document.getElementById('quality-menu').classList.remove('open');
      Utils.showToast(`Kalite ayarlandı: ${opt.innerText.replace('✓', '').trim()}`);
    });
  });
  
  // Subtitle Settings
  document.getElementById('sub-lang').addEventListener('change', toggleSubtitles);
  document.getElementById('sub-size').addEventListener('input', changeSubtitleSize);
  
  // Next Episode Actions (Disabled)
  // document.getElementById('btn-cancel-next').addEventListener('click', cancelNextEpisodeCountdown);
  // document.getElementById('btn-play-next').addEventListener('click', () => {
  //   const currentIndex = anime.episodes.findIndex(e => e.number === currentEpisode.number);
  //   const nextEpisode = anime.episodes[currentIndex + 1];
  //   if (nextEpisode) goToNextEpisode(nextEpisode.number);
  // });
  
  // Close menus on outside click
  document.addEventListener('click', () => {
    document.getElementById('quality-menu').classList.remove('open');
    document.getElementById('subtitle-settings').classList.remove('open');
  });
  
  // Stop propagation on menus
  document.getElementById('quality-menu').addEventListener('click', e => e.stopPropagation());
  document.getElementById('subtitle-settings').addEventListener('click', e => e.stopPropagation());
  
  // Action Buttons Setup
  setupActionButtons();
}

function setupActionButtons() {
  document.querySelectorAll('.watchlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const animeId = parseInt(btn.dataset.id);
      const isAdded = Utils.toggleWatchlist(animeId);
      
      if (isAdded) {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Listeden Çıkar`;
        Utils.showToast('Listeye eklendi', 'success');
      } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Listeye Ekle`;
        Utils.showToast('Listeden çıkarıldı', 'info');
      }
    });
  });
  
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const animeId = parseInt(btn.dataset.id);
      const isAdded = Utils.toggleFavorite(animeId);
      
      if (isAdded) {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Favori`;
        Utils.showToast('Favorilere eklendi', 'success');
      } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Favori`;
        Utils.showToast('Favorilerden çıkarıldı', 'info');
      }
    });
  });
}
