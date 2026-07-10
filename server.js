const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize a simple JSON database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ complaints: [] }, null, 2));
}

app.use(express.json());

// HTML UI Provider (Serves the entire Frontend dynamically)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VentSpace | Complain Anonymously</title>
    <style>
        :root {
            --bg-color: #121214;
            --card-color: #1a1a1e;
            --accent-color: #ff3b30;
            --text-color: #e1e1e6;
            --muted-color: #8d8d99;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 20px;
        }
        header { text-align: center; margin-bottom: 30px; }
        header h1 { font-size: 2.5rem; color: var(--accent-color); margin-bottom: 5px; }
        header p { color: var(--muted-color); }
        .container { max-width: 600px; margin: 0 auto; }
        .ad-container {
            background: #202024;
            border: 1px dashed #323238;
            border-radius: 8px;
            padding: 10px;
            margin: 20px 0;
            text-align: center;
        }
        .ad-label { font-size: 0.75rem; color: var(--muted-color); display: block; margin-bottom: 5px; }
        .mock-ad { color: #4c4c54; font-weight: bold; padding: 15px 0; }
        textarea {
            width: 100%; height: 120px; background-color: var(--card-color);
            border: 1px solid #323238; border-radius: 8px; color: var(--text-color);
            padding: 15px; box-sizing: border-box; font-size: 1rem; resize: vertical;
        }
        textarea:focus { outline: none; border-color: var(--accent-color); }
        button {
            width: 100%; background-color: var(--accent-color); color: white;
            border: none; padding: 12px; border-radius: 8px; font-size: 1rem;
            font-weight: bold; cursor: pointer; margin-top: 10px;
        }
        button:hover { background-color: #e03128; }
        .feed-section h2 { font-size: 1.25rem; border-bottom: 1px solid #323238; padding-bottom: 10px; margin-top: 30px; }
        .complaint-card { background-color: var(--card-color); border-radius: 8px; padding: 20px; margin-bottom: 15px; border: 1px solid #29292e; }
        .complaint-text { margin: 0 0 10px 0; line-height: 1.5; }
        .complaint-date { font-size: 0.8rem; color: var(--muted-color); }
    </style>
    </head>
<body>
    <header>
        <h1>🤬 VentSpace</h1>
        <p>Get it off your chest. Completely anonymously.</p>
    </header>
    <main class="container">
        <div class="ad-container">
            <span class="ad-label">Advertisement</span>
            <div class="mock-ad">Leaderboard Ad Unit (728x90)</div>
        </div>
        <section class="form-section">
            <form id="complaintForm">
                <textarea id="complaintInput" placeholder="What is ruining your day right now?" maxlength="500" required></textarea>
                <button type="submit">Release the Rage</button>
            </form>
        </section>
        <div class="ad-container">
            <span class="ad-label">Advertisement</span>
            <div class="mock-ad">In-Feed Responsive Ad Unit</div>
        </div>
        <section class="feed-section">
            <h2>Recent Complaints</h2>
            <div id="complaintsFeed"><p>Loading complaints...</p></div>
        </section>
    </main>
    <script>
        const form = document.getElementById('complaintForm');
        const input = document.getElementById('complaintInput');
        const feed = document.getElementById('complaintsFeed');

        async function loadComplaints() {
            const res = await fetch('/api/complaints');
            const data = await res.json();
            feed.innerHTML = '';
            if(data.length === 0) {
                feed.innerHTML = '<p>No complaints yet. Start the wave!</p>';
                return;
            }
            data.forEach(c => {
                const card = document.createElement('div');
                card.className = 'complaint-card';
                card.innerHTML = \`<p class="complaint-text">\${escapeHTML(c.text)}</p><span class="complaint-date">Posted on \${c.date}</span>\`;
                feed.appendChild(card);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input.value })
            });
            input.value = '';
            loadComplaints();
        });

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
        }
        loadComplaints();
    </script>
</body>
</html>
    `);
});

// Backend API: Get complaints
app.get('/api/complaints', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json([...data.complaints].reverse());
});

// Backend API: Post a complaint
app.post('/api/complaints', (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === "") return res.status(400).json({ error: "Empty" });

    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const newComplaint = {
        id: Date.now().toString(),
        text: text.substring(0, 500),
        date: new Date().toLocaleString()
    };
    
    data.complaints.push(newComplaint);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newComplaint);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
