const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
let allGames = [];

// Load games from JSON
fetch("games.json")
  .then(res => res.json())
  .then(data => {
    allGames = data.games;
    render(allGames);
  });

// Render games
function render(games) {
  grid.innerHTML = "";
  if (games.length === 0) {
    grid.innerHTML = "<p style='text-align:center;color:#888;'>No games found.</p>";
    return;
  }
  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = `
      <img src="${game.image}" alt="${game.name}">
      <div class="name">${game.name}</div>
    `;
    div.onclick = () => {
      window.location.href = `play.html?url=${encodeURIComponent(game.url)}`;
    };
    grid.appendChild(div);
  });
}

// Search filter
search.addEventListener("input", () => {
  const q = search.value.toLowerCase();
  render(allGames.filter(g => g.name.toLowerCase().includes(q)));
});
