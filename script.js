// Main elements
const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
let allGames = [];

// Settings elements
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const showNamesToggle = document.getElementById("showNamesToggle");
const funButton = document.getElementById("funButton");
const themeSelect = document.getElementById("themeSelect");

// Fetch games
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

// Search + bear Easter egg
search.addEventListener("input", () => {
  const q = search.value.toLowerCase();
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

// Settings panel open/close
settingsBtn.addEventListener("click", () => settingsPanel.classList.add("show"));
closeSettings.addEventListener("click", () => settingsPanel.classList.remove("show"));

// Show/hide game names
showNamesToggle.addEventListener("change", () => {
  document.querySelectorAll(".game .name").forEach(nameDiv => {
    nameDiv.style.display = showNamesToggle.checked ? "block" : "none";
  });
});

// Fun Easter egg
funButton.addEventListener("click", () => {
  alert("🎉 You found a secret in settings!");
});

// Theme switcher
themeSelect.addEventListener("change", () => {
  const theme = themeSelect.value;
  switch(theme) {
    case "purpleBlack":
      document.body.style.background = "#0b0b0b";
      document.body.style.color = "#e0d7ff";
      break;
    case "blueBlack":
      document.body.style.background = "#0b0b0b";
      document.body.style.color = "#7fd1ff";
      break;
    case "redBlack":
      document.body.style.background = "#0b0b0b";
      document.body.style.color = "#ff7f7f";
      break;
    case "greenBlack":
      document.body.style.background = "#0b0b0b";
      document.body.style.color = "#7fff7f";
      break;
  }
});
