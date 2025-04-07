const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

console.log('Starting server...');
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'website' folder - CORRECTED PATH
app.use(express.static(path.join(__dirname, '../website')));
console.log('Static file middleware added');

// Optional: Fallback route if you want to keep it (should come AFTER static middleware)
app.get('/', (req, res) => {
    // Only reached if there's no index.html in the website directory
    res.send('Server is working!');
});

// Function to generate simulated data
function generateSimulatedData() {
    const analogValue = Math.floor(Math.random() * 1024);
    io.emit('update', analogValue);
}

// Send updates every 100ms
setInterval(generateSimulatedData, 100);
console.log('Data simulation timer started');

io.on('connection', (socket) => {
    console.log('Client connected');
});
console.log('Socket.IO connection handler registered');

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Server running at http://localhost:3000');
});
console.log('Server listen method called');