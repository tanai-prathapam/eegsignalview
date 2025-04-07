const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

console.log('Starting server...'); // Log message indicating server start
const PORT = 3000; // Port number for the server

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'website' folder
app.get('/', (req, res) => {
    res.send('Server is working!');
  });
  
app.use(express.static('../website'));
console.log('Static file middleware added'); // Middleware to serve static files from the 'website' directory

// Function to generate simulated analog data
function generateSimulatedData() {
  // Generate a random value between 0 and 1023 (10-bit ADC simulation)
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
