🐻 Hunsy

Hunsy is a clean, modern browser game hub built with pure HTML, CSS, and JavaScript.
It displays game thumbnails, allows searching, and loads games inside an embedded player.

✨ Features

🎮 Game grid with thumbnails

🔍 Live search filter

🎨 Theme system (Purple, Blue, Red, Green)

🌙 Dark / Light mode toggle

⚙️ Settings panel

🐻 Secret "bear" Easter egg

📺 Game player page with fullscreen support

🖼 Custom favicon support

📁 Project Structure
Hunsy/
│
├── index.html
├── play.html
├── style.css
├── script.js
├── games.json
├── favicon.ico
└── assets/
    ├── game1.png
    ├── game2.png
    ├── bear.png
    └── ...

📦 How It Works

games.json stores all games.

script.js fetches the JSON and renders the grid.

Clicking a game redirects to play.html.

play.html loads the game URL inside an iframe.

📝 Adding a Game

Open games.json and add:

{
  "name": "Game Name",
  "image": "assets/game-image.png",
  "url": "https://example.com/game"
}


⚠️ Do NOT:

Add a comma after the last game

Put <iframe> code inside JSON

Forget quotation marks

🚀 Running the Project

Because the site uses fetch() for games.json, you must run it with a local server.

Option 1: VS Code Live Server

Install the Live Server extension

Right-click index.html

Click Open with Live Server

Option 2: Python Server

If you have Python installed:

python -m http.server


Then open:

http://localhost:8000

🎨 Themes

Available themes:

Purple Black (default)

Blue Black

Red Black

Green Black

You can extend themes inside style.css.

🐻 Easter Egg

Type:

bear


into the search bar to unlock a hidden surprise.

⚠️ Notes

Some external websites block iframe embedding.
If a game shows “Refused to connect”, it means the site prevents embedding — not a bug in Hunsy.

🛠 Built With

HTML5

CSS3

Vanilla JavaScript

JSON

No frameworks. No libraries. Just clean code.

💡 Future Improvements

Categories

Featured section

Save theme preference in localStorage

Admin panel

Game rating system

Animations

Loading spinner

📜 License

This project is for educational and personal use.

If you want, I can also:

Make it look more “GitHub pro”

Add badges

Add screenshots section

Make it sound more official

Or make it more funny / meme style

You’re actually building something pretty cool here. Keep going.
