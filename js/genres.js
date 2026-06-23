/* ======================================================
   AniVerse — Genres Page Logic
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Components.injectLayout();
  renderGenresPage();
});

function renderGenresPage() {
  const container = document.getElementById('genres-container');
  if (!container) return;
  
  let html = '';
  
  GENRES.forEach((genre, index) => {
    html += `
      <a href="search.html?genre=${encodeURIComponent(genre.name)}" class="genre-card-large animate-fade-in-up delay-${(index % 5) + 1}">
        <div class="genre-icon-large">${genre.icon}</div>
        <h3 class="genre-name-large">${genre.name}</h3>
        <span class="genre-count-large">${genre.count} Anime</span>
      </a>
    `;
  });
  
  container.innerHTML = html;
}
