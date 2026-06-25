/* ======================================================
   AniVerse - App (Home Page) Logic
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inject Navbar and Footer
  Components.injectLayout();
  
  // Render Sections
  renderHero();
  renderContinueWatching();
  renderPopularWeekly();
  renderNewEpisodes();
});

// 🌟 Render Hero Section 🌟
function renderHero() {
  const heroContainer = document.getElementById('hero-slider');
  if (!heroContainer) return;
  heroContainer.className = 'hero-accordion-container';
  let html = '';
  
  const validSlides = HERO_SLIDES.filter(s => Utils.getAnimeById(s.animeId));
  const displayList = validSlides.length > 0 ? validSlides.map(s => Utils.getAnimeById(s.animeId)) : ANIME_DATA.slice(0, 3);

  displayList.forEach((anime) => {
    if (!anime) return;
    html += `
      <div class="hero-panel" data-id="${anime.id}" onclick="window.location.href='watch.html?id=${anime.id}'">
        <img src="${anime.banner || anime.image}" alt="${anime.title}" class="hero-panel-bg">
        <div class="hero-panel-gradient"></div>
        <div class="hero-panel-badge-sm">${anime.genres && anime.genres.length > 0 ? anime.genres[0] : 'Anime'}</div>
        <div class="hero-panel-content">
          <div class="hero-badges">
            <span class="badge badge-primary">${anime.season || 'Yeni'}</span>
            <span class="badge badge-warning">★ ${Utils.formatRating(anime.rating || 8.5)}</span>
          </div>
          <h2 class="hero-panel-title">${anime.title}</h2>
          <p class="hero-panel-desc">${anime.description || ''}</p>
          <button class="btn btn-primary mt-4" style="pointer-events: auto; padding: 10px 20px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Hemen İzle
          </button>
        </div>
      </div>
    `;
  });
  heroContainer.innerHTML = html;
}

function renderContinueWatching() {
  const container = document.getElementById('continue-watching');
  if (!container) return;
  
  const history = Utils.getHistory();
  let items = CONTINUE_WATCHING;
  
  if (history && history.length > 0) {
    items = history.slice(0, 5).map(h => ({
      animeId: h.animeId,
      episode: h.episode,
      progress: Utils.getProgress(h.animeId)?.percentage || 50,
      lastWatched: Utils.timeAgo(h.timestamp)
    }));
  }
  
  if (items.length === 0) {
    container.parentElement.style.display = 'none';
    return;
  }
  
  let html = '';
  items.forEach(item => {
    html += Components.renderContinueWatchingCard(item);
  });
  
  container.innerHTML = html;
  Utils.initLazyLoading();
}

function renderPopularWeekly() {
  const container = document.getElementById('popular-weekly');
  if (!container) return;
  
  const trending = [...ANIME_DATA].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
  
  let html = '';
  trending.forEach((anime, index) => {
    const rank = index < 3 ? index + 1 : null;
    html += `
      <div class="relative anime-card-wrapper reveal-right delay-${(index % 5) + 1}">
        ${Components.renderAnimeCard(anime, '', rank)}
      </div>
    `;
  });
  
  container.innerHTML = html;
  Utils.initLazyLoading();
  Utils.initScrollReveal();
}

function renderNewEpisodes() {
  const container = document.getElementById('new-episodes');
  if (!container) return;
  
  const newest = ANIME_DATA.filter(a => a.isNew).slice(0, 8);
  
  let html = '';
  newest.forEach((anime, index) => {
    html += `
      <div class="reveal-scale delay-${(index % 4) + 1}">
        ${Components.renderAnimeCard(anime)}
      </div>
    `;
  });
  
  container.innerHTML = html;
  Utils.initLazyLoading();
  Utils.initScrollReveal();
}

// Setup Watchlist Buttons globally
function setupWatchlistButtons(container = document) {
  const buttons = container.querySelectorAll('.watchlist-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const animeId = parseInt(btn.dataset.id);
      if (!animeId) return;
      
      const isInList = Utils.toggleWatchlist(animeId);
      
      if (isInList) {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
        btn.setAttribute('title', 'Listeden Çıkar');
        btn.classList.add('active');
        Components.showToast('Listeye eklendi');
      } else {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
        btn.setAttribute('title', 'Listeye Ekle');
        btn.classList.remove('active');
        Components.showToast('Listeden çıkarıldı');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    setupWatchlistButtons();
  }, 500);
});

const style = document.createElement('style');
style.textContent = `
  /* Accordion Hero Section */
  .hero-section {
    margin-top: calc(-1 * var(--nav-height));
    padding-top: calc(var(--nav-height) + 20px);
    margin-bottom: 60px;
  }
  .hero-accordion-container {
    display: flex;
    gap: 15px;
    width: 100%;
    height: 600px;
    padding: 0 var(--container-padding);
    max-width: var(--container-max);
    margin: 0 auto;
  }
  .hero-panel {
    flex: 1;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: flex-end;
  }
  .hero-panel:hover {
    flex: 5;
  }
  .hero-panel-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    transition: all 0.5s ease;
  }
  .hero-panel:hover .hero-panel-bg {
    transform: scale(1.05);
  }
  .hero-panel-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    background: linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.4) 50%, transparent 100%);
    z-index: 2;
  }
  .hero-panel-badge-sm {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(5px);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    z-index: 3;
    transition: opacity 0.3s ease;
  }
  .hero-panel:hover .hero-panel-badge-sm {
    opacity: 0;
    pointer-events: none;
  }
  .hero-panel-content {
    position: relative;
    z-index: 4;
    padding: 40px;
    width: 100%;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease 0.2s;
    pointer-events: none;
  }
  .hero-panel:hover .hero-panel-content {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .hero-panel-title {
    font-size: 3rem;
    font-family: var(--font-display);
    margin-bottom: 10px;
    text-shadow: 0 4px 10px rgba(0,0,0,0.8);
    line-height: 1.1;
    white-space: nowrap;
  }
  .hero-panel-desc {
    color: rgba(255, 255, 255, 0.8);
    max-width: 500px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 20px;
    text-shadow: 0 2px 5px rgba(0,0,0,0.8);
    white-space: normal;
  }
  @media (max-width: 768px) {
    .hero-accordion-container {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      height: 500px;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 20px;
    }
    .hero-accordion-container::-webkit-scrollbar {
      display: none;
    }
    .hero-panel {
      width: 85vw;
      flex: 0 0 auto;
      scroll-snap-align: center;
    }
    .hero-panel:hover {
      flex: 0 0 auto;
    }
    .hero-panel-title {
      font-size: 2rem;
    }
    .hero-panel-content {
      padding: 20px;
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: translateY(0) !important;
    }
    .hero-panel-badge-sm {
      opacity: 0 !important;
      display: none !important;
    }
  }
`;
document.head.appendChild(style);
