/* ======================================================
   AniVerse — Trending Page Logic
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Components.injectLayout();
  renderTrendingPage();
});

function renderTrendingPage() {
  const top3Container = document.getElementById('top-3-container');
  const restContainer = document.getElementById('rest-trending-container');
  
  if (!top3Container || !restContainer) return;
  
  // Get trending sorted by popularity
  const trending = [...ANIME_DATA].sort((a, b) => b.popularity - a.popularity);
  
  // Separate top 3
  const top3 = trending.slice(0, 3);
  const rest = trending.slice(3, 15); // Show next 12
  
  // Render Top 3 (Podium style: 2, 1, 3)
  const podiumOrder = [
    { item: top3[1], rank: 2, class: 'rank-2 delay-2' },
    { item: top3[0], rank: 1, class: 'rank-1 delay-1' },
    { item: top3[2], rank: 3, class: 'rank-3 delay-3' }
  ];
  
  let top3Html = '';
  podiumOrder.forEach(pos => {
    if (pos.item) {
      top3Html += `
        <div class="top-3-card animate-fade-in-up ${pos.class}">
          <div class="rank-badge-large">${pos.rank}</div>
          ${Components.renderAnimeCard(pos.item)}
        </div>
      `;
    }
  });
  top3Container.innerHTML = top3Html;
  
  // Render Rest
  let restHtml = '';
  rest.forEach((anime, index) => {
    restHtml += `
      <div class="relative anime-card-wrapper reveal-scale delay-${(index % 4) + 1}">
        ${Components.renderAnimeCard(anime, '', index + 4)}
      </div>
    `;
  });
  restContainer.innerHTML = restHtml;
  
  Utils.initLazyLoading();
  Utils.initScrollReveal();
}
