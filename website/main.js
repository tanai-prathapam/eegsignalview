// Core configuration and setup
const channels = 8;
const maxPoints = 100;
const channelData = Array(channels).fill().map(() => ({
  times: [],
  values: []
}));

const channelNames = [
  'Frontal (Fp1)', 'Frontal (Fp2)', 
  'Temporal (T3)', 'Temporal (T4)', 
  'Parietal (P3)', 'Parietal (P4)', 
  'Occipital (O1)', 'Occipital (O2)'
];

// Setup initial plots
function setupGraphs() {
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
}

// Helper function for colors
function getColor(index) {
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', 
                 '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];
  return colors[index % colors.length];
}

// Generate data for all channels
function generateDemoData() {
  return Array(channels).fill().map((_, i) => {
    const baseFreq = 0.1 + (i * 0.05);
    const amplitude = 10 + (i * 5);
    const noise = Math.random() * 5;
    const t = Date.now() / 1000;
    
    return amplitude * Math.sin(baseFreq * t) + noise;
  });
}

// Update all graphs with new data
function updateGraphs(newValues) {
  const currentTime = new Date().toLocaleTimeString();
  
  for (let i = 0; i < channels; i++) {
    channelData[i].times.push(currentTime);
    channelData[i].values.push(newValues[i]);
    
    if (channelData[i].times.length > maxPoints) {
      channelData[i].times.shift();
      channelData[i].values.shift();
    }
    
    Plotly.update(`graph${i+1}`, {
      x: [channelData[i].times],
      y: [channelData[i].values]
    });
  }
}

// Main function to run everything
function initializeGraphs() {
  console.log("Initializing EEG graphs with demo data");
  setupGraphs();
  
  // Add initial data
  for (let i = 0; i < 20; i++) {
    updateGraphs(generateDemoData());
  }
  
  // Set up continuous updates
  setInterval(() => {
    updateGraphs(generateDemoData());
  }, 100);
  
  // Optional: Try to connect to socket if available
  try {
    const socket = io();
    socket.on('update', updateGraphs);
  } catch (e) {
    console.log('Running in demo mode only');
  }
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGraphs);
