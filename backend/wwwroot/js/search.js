/* ======================================================
   AniVerse — Search & Explore Logic
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Components.injectLayout();
  
  // Initialize from URL params
  const initialQuery = Utils.getUrlParam('q') || '';
  const initialGenre = Utils.getUrlParam('genre') || 'all';
  const initialYear = Utils.getUrlParam('year') || 'all';
  const initialStatus = Utils.getUrlParam('status') || 'all';
  const initialSort = Utils.getUrlParam('sort') || 'popular';
  
  // Set UI state
  if (initialQuery) document.getElementById('search-input').value = initialQuery;
  document.getElementById('genre-filter').value = initialGenre;
  document.getElementById('year-filter').value = initialYear;
  document.getElementById('status-filter').value = initialStatus;
  document.getElementById('sort-filter').value = initialSort;
  
  if (initialQuery) {
    document.getElementById('clear-search-btn').classList.add('visible');
  }
  
  // Initial render
  performSearch();
  
  // Setup Listeners
  setupSearchListeners();
  
  // Populate genres dynamically (optional, doing it statically in HTML for now)
});

// ── Search Logic ──

function performSearch() {
  const query = document.getElementById('search-input').value;
  const genre = document.getElementById('genre-filter').value;
  const year = document.getElementById('year-filter').value;
  const status = document.getElementById('status-filter').value;
  const sort = document.getElementById('sort-filter').value;
  
  // Update URL silently
  const url = new URL(window.location);
  if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
  if (genre !== 'all') url.searchParams.set('genre', genre); else url.searchParams.delete('genre');
  if (year !== 'all') url.searchParams.set('year', year); else url.searchParams.delete('year');
  if (status !== 'all') url.searchParams.set('status', status); else url.searchParams.delete('status');
  if (sort !== 'popular') url.searchParams.set('sort', sort); else url.searchParams.delete('sort');
  window.history.replaceState({}, '', url);
  
  // Get Results
  const results = Utils.searchAnime(query, { genre, year, status, sort });
  
  // Render
  renderResults(results);
}

function renderResults(results) {
  const container = document.getElementById('search-results');
  const countEl = document.getElementById('results-count');
  
  countEl.textContent = `${results.length} Sonuç Bulundu`;
  
  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">Sonuç Bulunamadı</h3>
        <p class="empty-state-text">Arama kriterlerinize uygun anime bulamadık. Lütfen farklı filtreler deneyin.</p>
        <button class="btn btn-primary mt-6" onclick="resetFilters()">Filtreleri Temizle</button>
      </div>
    `;
    return;
  }
  
  let html = '';
  results.forEach((anime, index) => {
    // Add small delay for staggered animation
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

// ── Event Listeners ──

function setupSearchListeners() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const filters = document.querySelectorAll('.filter-select');
  
  // Debounced Search
  const debouncedSearch = Utils.debounce(() => {
    performSearch();
  }, 400);
  
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim() !== '') {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
    debouncedSearch();
  });
  
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('visible');
    searchInput.focus();
    performSearch();
  });
  
  // Filters
  filters.forEach(filter => {
    filter.addEventListener('change', performSearch);
  });
}

window.resetFilters = function() {
  document.getElementById('search-input').value = '';
  document.getElementById('clear-search-btn').classList.remove('visible');
  document.getElementById('genre-filter').value = 'all';
  document.getElementById('year-filter').value = 'all';
  document.getElementById('status-filter').value = 'all';
  document.getElementById('sort-filter').value = 'popular';
  
  performSearch();
};
