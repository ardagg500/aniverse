/* ======================================================
   AniVerse — Genres Page Logic
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Components.injectLayout();
  renderGenresPage();
});

async function renderGenresPage() {
  const container = document.getElementById('genres-container');
  if (!container) return;

  let genreList = typeof GENRES !== 'undefined' ? [...GENRES] : [];

  try {
    const res = await fetch('/api/admin/genres-count');
    if (res.ok) {
      const counts = await res.json();
      genreList = genreList.map(g => {
        const found = counts.find(c => c.name.toLowerCase() === g.name.toLowerCase());
        return {
          ...g,
          count: found && found.count > 0 ? found.count : (g.count || 0)
        };
      });
    }
  } catch (e) {
    console.warn('API genre count fetch error, fallback to static counts.');
  }
  
  let html = '';
  
  genreList.forEach((genre, index) => {
    html += `
      <a href="/search.html?genre=${encodeURIComponent(genre.name)}" class="genre-card-large animate-fade-in-up delay-${(index % 5) + 1}">
        <div class="genre-icon-large">${genre.icon}</div>
        <h3 class="genre-name-large">${genre.name}</h3>
        <span class="genre-count-large">${genre.count} Anime</span>
      </a>
    `;
  });
  
  container.innerHTML = html;
}
