<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebGames Portal - Clone</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #2a2d32;
            color: #fff;
            padding-bottom: 50px;
        }

        /* Navbar Styling */
        header {
            background-color: #1c1e22;
            padding: 15px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #00ff66;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .search-bar {
            width: 40%;
            padding: 10px 20px;
            border-radius: 20px;
            border: none;
            background-color: #3a3f47;
            color: white;
            font-size: 16px;
            outline: none;
        }

        /* Poki-style Mosaic Grid */
        .container {
            max-width: 1400px;
            margin: 40px auto;
            padding: 0 20px;
        }

        .game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            grid-gap: 20px;
            grid-auto-flow: dense;
        }

        /* Replicating the varied tile sizes of Poki */
        .game-card {
            background-color: #3a3f47;
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            position: relative;
            display: flex;
            flex-direction: column;
            aspect-ratio: 1 / 1;
        }

        .game-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }

        /* Making some random cards larger for the "Poki" mosaic feel */
        .game-card.large {
            grid-column: span 2;
            grid-row: span 2;
        }

        .game-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .game-title {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.85));
            padding: 15px 10px 10px 10px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
        }

        /* Game Player Modal */
        .modal {
            display: none; 
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            position: relative;
            width: 80%;
            height: 80%;
            background-color: #000;
            border-radius: 12px;
            overflow: hidden;
        }

        .close-btn {
            position: absolute;
            top: -40px;
            right: 0;
            color: #fff;
            font-size: 30px;
            cursor: pointer;
            background: none;
            border: none;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>

    <header>
        <div class="logo">PokiClone</div>
        <input type="text" class="search-bar" placeholder="Search for games...">
        <div style="width: 80px;"></div> </header>

    <div class="container">
        <main class="game-grid" id="gameGrid">
            </main>
    </div>

    <div class="modal" id="gameModal">
        <div class="modal-content">
            <button class="close-btn" onclick="closeGame()">&times; Close</button>
            <iframe id="gameFrame" src=""></iframe>
        </div>
    </div>

    <script>
        // Sample Game Data (Replace URLs with real HTML5 game links or open-source games)
        const games = [
            { id: 1, title: "Space Shooter", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300", url: "https://play.enclavegames.com/breakout/", size: "large" },
            { id: 2, title: "Cyber Runner", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300", url: "https://play.enclavegames.com/bounce/", size: "normal" },
            { id: 3, title: "Retro Brick", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300", url: "https://play.enclavegames.com/breakout/", size: "normal" },
            { id: 4, title: "Puzzle Master", img: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=300", url: "https://play.enclavegames.com/bounce/", size: "large" },
            { id: 5, title: "Speed Racer", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300", url: "https://play.enclavegames.com/breakout/", size: "normal" },
            { id: 6, title: "Ninja Slash", img: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300", url: "https://play.enclavegames.com/bounce/", size: "normal" },
            { id: 7, title: "Pixel Quest", img: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300", url: "https://play.enclavegames.com/breakout/", size: "normal" },
            { id: 8, title: "Arena Combat", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300", url: "https://play.enclavegames.com/bounce/", size: "large" },
        ];

        const grid = document.getElementById('gameGrid');
        const modal = document.getElementById('gameModal');
        const iframe = document.getElementById('gameFrame');

        // Render Games
        function loadGames() {
            games.forEach(game => {
                const card = document.createElement('div');
                card.className = `game-card ${game.size}`;
                card.onclick = () => openGame(game.url);
                
                card.innerHTML = `
                    <img src="${game.img}" alt="${game.title}">
                    <div class="game-title">${game.title}</div>
                `;
                grid.appendChild(card);
            });
        }

        // Modal Controls
        function openGame(url) {
            iframe.src = url;
            modal.style.display = "flex";
        }

        function closeGame() {
            modal.style.display = "none";
            iframe.src = ""; // Stops the game audio/state when closed
        }

        // Initialize
        loadGames();
    </script>
</body>
</html>
