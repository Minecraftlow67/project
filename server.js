const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the frontend interface dynamically
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connection Lounge</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #13131a; color: #f1f2f6; margin: 0;
            display: flex; flex-direction: column; height: 100vh;
        }
        header { background: #1c1c24; padding: 15px; text-align: center; border-bottom: 1px solid #2f303d; }
        #chatBox { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .msg { padding: 10px 14px; border-radius: 8px; max-width: 70%; word-break: break-word; }
        .system { background: #2f303d; color: #a4b0be; align-self: center; font-size: 0.85rem; }
        .incoming { background: #232430; align-self: flex-start; }
        .outgoing { background: #5865f2; align-self: flex-end; }
        footer { padding: 15px; background: #1c1c24; display: flex; gap: 10px; }
        input { flex: 1; background: #13131a; border: 1px solid #2f303d; border-radius: 6px; padding: 12px; color: white; outline: none; }
        button { background: #5865f2; color: white; border: none; padding: 0 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
        button:disabled { background: #3a3b4c; cursor: not-allowed; }
    </style>
</head>
<body>
    <header><h2>🤝 Peer Connection Space</h2></header>
    <main id="chatBox"></main>
    <footer>
        <input type="text" id="msgInput" placeholder="Waiting for a connection partner..." disabled>
        <button id="sendBtn" disabled>Send</button>
    </footer>
    <script>
        const chatBox = document.getElementById('chatBox');
        const msgInput = document.getElementById('msgInput');
        const sendBtn = document.getElementById('sendBtn');

        // Automatically determine if using secure (wss) or unsecure (ws) connections based on hosting environment
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws = new WebSocket(\`\${protocol}://\${window.location.host}\`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const msgDiv = document.createElement('div');

            if (data.type === 'system') {
                msgDiv.className = 'msg system';
                msgDiv.innerText = data.text;
                if(data.text.includes("Connected")) {
                    msgInput.disabled = false;
                    msgInput.placeholder = "Type a message safely...";
                    sendBtn.disabled = false;
                }
            } else if (data.type === 'chat') {
                msgDiv.className = 'msg incoming';
                msgDiv.innerText = data.text;
            }
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        function sendMessage() {
            const text = msgInput.value.trim();
            if(!text) return;
            ws.send(JSON.stringify({ type: 'chat', text: text }));
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg outgoing';
            msgDiv.innerText = text;
            chatBox.appendChild(msgDiv);
            msgInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        sendBtn.addEventListener('click', sendMessage);
        msgInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>
    `);
});

// Matchmaking Queue Engine
let waitingQueue = [];

wss.on('connection', (ws) => {
    ws.isMatched = false;
    ws.partner = null;

    tryMatch(ws);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'chat' && ws.partner && ws.partner.readyState === WebSocket.OPEN) {
                ws.partner.send(JSON.stringify({ type: 'chat', text: data.text }));
            }
        } catch (e) {
            console.error("Invalid packet data structure dropped.");
        }
    });

    ws.on('close', () => {
        waitingQueue = waitingQueue.filter(client => client !== ws);
        if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
            ws.partner.send(JSON.stringify({ type: 'system', text: "Your partner has left the conversation." }));
            ws.partner.isMatched = false;
            ws.partner.partner = null;
            tryMatch(ws.partner);
        }
    });
});

function tryMatch(ws) {
    if (waitingQueue.length > 0) {
        const partner = waitingQueue.shift();
        ws.isMatched = true;
        ws.partner = partner;
        partner.isMatched = true;
        partner.partner = ws;

        ws.send(JSON.stringify({ type: 'system', text: "Connected with someone! Say hello safely." }));
        partner.send(JSON.stringify({ type: 'system', text: "Connected with someone! Say hello safely." }));
    } else {
        waitingQueue.push(ws);
        ws.send(JSON.stringify({ type: 'system', text: "Looking for an available connection... Please hold." }));
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Application router live on port ${PORT}`);
});
