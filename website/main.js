// Initialize data arrays for 8 channels
const channels = 8;
const maxPoints = 100; // Maximum number of points to display
const channelData = Array(channels).fill().map(() => ({
  times: [],
  values: []
}));

// Channel names/labels
const channelNames = [
  'Frontal (Fp1)', 
  'Frontal (Fp2)', 
  'Temporal (T3)', 
  'Temporal (T4)', 
  'Parietal (P3)', 
  'Parietal (P4)', 
  'Occipital (O1)', 
  'Occipital (O2)'
];

// Create initial plots for each channel
for (let i = 0; i < channels; i++) {
  Plotly.newPlot(`graph${i+1}`, [{
    x: channelData[i].times,
    y: channelData[i].values,
    type: 'line',
    name: channelNames[i],
    line: { color: getColor(i) }
  }], {
    title: channelNames[i],
    xaxis: { title: 'Time', showgrid: false },
    yaxis: { title: 'μV', showgrid: true },
    margin: { l: 50, r: 10, t: 40, b: 50 },
    autosize: true
  }, { responsive: true });
}

// Function to get a unique color for each channel
function getColor(index) {
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', 
                 '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];
  return colors[index % colors.length];
}

// Connect to the WebSocket server
const socket = io();

// For demo/testing: Generate random data if no WebSocket data is available
function generateDemoData() {
  // Generate unique patterns for each channel
  return Array(channels).fill().map((_, i) => {
    const baseFreq = 0.1 + (i * 0.05); // Different base frequency for each channel
    const amplitude = 10 + (i * 5);    // Different amplitude for each channel
    const noise = Math.random() * 5;   // Random noise
    const t = Date.now() / 1000;       // Current time in seconds
    
    // Generate a value with sine wave + some noise for more realistic EEG look
    const val = amplitude * Math.sin(baseFreq * t) + noise;
    return val;
  });
}

// Add data points to each channel
function updateGraphs(newValues) {
  const currentTime = new Date().toLocaleTimeString();
  
  for (let i = 0; i < channels; i++) {
    // Add new data point
    channelData[i].times.push(currentTime);
    channelData[i].values.push(newValues[i]);
    
    // Remove old data points if we have too many
    if (channelData[i].times.length > maxPoints) {
      channelData[i].times.shift();
      channelData[i].values.shift();
    }
    
    // Update the graph
    Plotly.update(`graph${i+1}`, {
      x: [channelData[i].times],
      y: [channelData[i].values]
    });
  }
}

// Listen for data updates from server
socket.on('update', function(values) {
  updateGraphs(values);
});

// For demo: If no data received after 1 second, start generating random data
let demoMode = false;
setTimeout(() => {
  if (channelData[0].values.length === 0) {
    demoMode = true;
    console.log("No server data detected. Running in demo mode with simulated data.");
    setInterval(() => {
      updateGraphs(generateDemoData());
    }, 100);
  }
}, 1000);
