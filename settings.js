const cloakList = document.getElementById("cloakList");

fetch("cloak.json")
  .then(res => res.json())
  .then(data => {
    data.cloaks.forEach(cloak => {
      const div = document.createElement("div");
      div.className = "cloak-option";

      div.innerHTML = `
        <img src="${cloak.tabimg}">
        <span>${cloak.name}</span>
      `;

      div.onclick = () => applyCloak(cloak);

      cloakList.appendChild(div);
    });
  });

function applyCloak(cloak) {
  localStorage.setItem("cloakName", cloak.name);
  localStorage.setItem("cloakIcon", cloak.tabimg);

  alert("Cloak applied! Refresh or go home.");
}

function resetCloak() {
  localStorage.removeItem("cloakName");
  localStorage.removeItem("cloakIcon");
  alert("Cloak reset!");
}
