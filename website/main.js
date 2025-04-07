// Initialize data arrays
let times = [];
let values = [];
const maxPoints = 100; // Maximum number of points to display

// Create initial plot
Plotly.newPlot('graph', [{
  x: times,
  y: values,
  type: 'line',
  name: 'Voltage Value'
}], {
  title: 'Real-time Voltage Monitoring',
  xaxis: { title: 'Time' },
  yaxis: { title: 'Voltage (0-3.3V'}
});

// Connect to the WebSocket server
const socket = io();

// Listen for data updates
socket.on('update', function(value) {
  // Add new data point
  times.push(new Date().toLocaleTimeString());
  values.push(value);
  
  // Remove old data points if we have too many
  if (times.length > maxPoints) {
    times.shift();
    values.shift();
  }
  
  // Update the graph
  Plotly.update('graph', {
    x: [times],
    y: [values]
  });
});
