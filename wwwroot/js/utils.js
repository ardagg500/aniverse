/* ======================================================
   AniVerse — Utility Functions
   ====================================================== */

const Utils = {

  // ── Security & Sanitization Helpers (XSS Protection) ──
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  sanitizeUrl(url) {
    if (!url) return '';
    const clean = String(url).trim();
    if (clean.toLowerCase().startsWith('javascript:') || clean.toLowerCase().startsWith('data:')) {
      return 'about:blank';
    }
    return clean;
  },

  // ── LocalStorage Helpers ──

  getFromStorage(key) {
    try {
      const data = localStorage.getItem(`aniverse_${key}`);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  saveToStorage(key, value) {
    try {
      localStorage.setItem(`aniverse_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage full or unavailable:', e);
    }
  },

  // ── Watchlist ──

  getWatchlist() {
    return this.getFromStorage('watchlist') || [];
  },

  isInWatchlist(animeId) {
    return this.getWatchlist().includes(animeId);
  },

  toggleWatchlist(animeId) {
    const list = this.getWatchlist();
    const index = list.indexOf(animeId);
    if (index > -1) {
      list.splice(index, 1);
      this.saveToStorage('watchlist', list);
      return false;
    } else {
      list.push(animeId);
      this.saveToStorage('watchlist', list);
      return true;
    }
  },

  // ── Favorites ──

  getFavorites() {
    return this.getFromStorage('favorites') || [];
  },

  isInFavorites(animeId) {
    return this.getFavorites().includes(animeId);
  },

  toggleFavorite(animeId) {
    const list = this.getFavorites();
    const index = list.indexOf(animeId);
    if (index > -1) {
      list.splice(index, 1);
      this.saveToStorage('favorites', list);
      return false;
    } else {
      list.push(animeId);
      this.saveToStorage('favorites', list);
      return true;
    }
  },

  // ── Watch History ──

  getHistory() {
    return this.getFromStorage('history') || [];
  },

  addToHistory(animeId, episode) {
    const history = this.getHistory();
    const filtered = history.filter(h => !(h.animeId === animeId && h.episode === episode));
    filtered.unshift({
      animeId,
      episode,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('tr-TR')
    });
    this.saveToStorage('history', filtered.slice(0, 50));
  },

  // ── Watch Progress ──

  getProgress(animeId) {
    const progress = this.getFromStorage('progress') || {};
    return progress[animeId] || null;
  },

  saveProgress(animeId, episode, currentTime, duration) {
    const progress = this.getFromStorage('progress') || {};
    progress[animeId] = {
      episode,
      currentTime,
      duration,
      percentage: duration > 0 ? Math.round((currentTime / duration) * 100) : 0,
      updatedAt: Date.now()
    };
    this.saveToStorage('progress', progress);
  },

  // ── Data Helpers ──

  getAnimeById(id) {
    return ANIME_DATA.find(a => a.id === parseInt(id));
  },

  searchAnime(query, filters = {}) {
    let results = [...ANIME_DATA];

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.titleJp.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.genres.some(g => g.toLowerCase().includes(q)) ||
        a.studio.toLowerCase().includes(q)
      );
    }

    if (filters.genre && filters.genre !== 'all') {
      results = results.filter(a => a.genres.includes(filters.genre));
    }

    if (filters.year && filters.year !== 'all') {
      results = results.filter(a => a.year === parseInt(filters.year));
    }

    if (filters.status && filters.status !== 'all') {
      results = results.filter(a => a.status === filters.status);
    }

    switch (filters.sort) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => b.year - a.year);
        break;
      case 'name':
        results.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
        break;
      case 'popular':
      default:
        results.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return results;
  },

  // ── Formatting ──

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  formatRating(rating) {
    return rating.toFixed(1);
  },

  timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Az önce';
    if (mins < 60) return `${mins} dk önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return new Date(timestamp).toLocaleDateString('tr-TR');
  },

  // ── Debounce ──

  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // ── Throttle ──

  throttle(fn, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // ── Lazy Loading with IntersectionObserver ──

  initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  },

  // ── Scroll Reveal ──

  initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  },

  // ── Toast Notification ──

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeInRight 0.3s var(--ease-out) reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // ── Navbar Scroll Effect ──

  initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', this.throttle(() => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, 50));
  },

  // ── Mobile Nav ──

  initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.mobile-nav-close');

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', () => {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeNav = () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  },

  // ── URL Params ──

  getUrlParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  },

  // ── Get Fallback Gradient ──

  getFallbackGradient(id) {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
      'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
    ];
    return gradients[(id - 1) % gradients.length];
  },

  // ── Smooth Horizontal Scroll ──

  initHorizontalScroll() {
    document.querySelectorAll('.scroll-row, .horizontal-scroll-container').forEach(row => {
      let isDown = false;
      let startX, scrollLeft;

      row.addEventListener('mousedown', e => {
        isDown = true;
        row.style.cursor = 'grabbing';
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
      });

      row.addEventListener('mouseleave', () => {
        isDown = false;
        row.style.cursor = '';
      });

      row.addEventListener('mouseup', () => {
        isDown = false;
        row.style.cursor = '';
      });

      row.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - row.offsetLeft;
        const walk = (x - startX) * 1.5;
        row.scrollLeft = scrollLeft - walk;
      });
    });
  },

  // ── Initialize Common Utilities ──

  initCommon() {
    this.initNavbarScroll();
    this.initMobileNav();
    this.initLazyLoading();
    this.initScrollReveal();
    this.initHorizontalScroll();
  }
};
