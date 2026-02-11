const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
let allGames = [];

fetch("games.json")
  .then(res => res.json())
  .then(data => {
    allGames = data.games;
    render(allGames);
  });

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

search.addEventListener("input", () => {
  const q = search.value.toLowerCase();

  // Easter egg: if user types 'bear', show the bear image
  if (q === "bear") {
    grid.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;flex-direction:column;">
        <img src="assets/bear.png" style="width:300px;height:auto;margin-top:20px;">
        <div style="color:#b784ff;font-size:24px;margin-top:10px;">🐻 You found the bear!</div>
      </div>
    `;
    return;
  }

  render(allGames.filter(g => g.name.toLowerCase().includes(q)));
});
