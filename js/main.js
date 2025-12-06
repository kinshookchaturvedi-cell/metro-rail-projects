// Metro Rail Projects Tracker - Main JavaScript with Global Support & Auto-Update
let allMetroData = {}; // Store all data globally

// Function to load data from data.json
async function loadMetroData() {
  try {
    const response = await fetch('data/projects.json');
    const data = await response.json();
    allMetroData = data; // Store globally for access
    displayStats(data);
    displayNews(data);
    populateCityDropdown(data);
    populateGlobalCityDropdown(data);
    createCityClickableList(data);
    updateLastRefreshTime();
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('india-stats').innerHTML = 'Error loading data';
    document.getElementById('global-stats').innerHTML = 'Error loading data';
    document.getElementById('news-list').innerHTML = 'Error loading news';
  }
}

// Function to update last refresh timestamp
function updateLastRefreshTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const lastUpdateEl = document.getElementById('last-update-time');
  if (lastUpdateEl) {
    lastUpdateEl.textContent = 'Last updated: ' + timeString;
  }
}

// Function to display statistics
function displayStats(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India');
  const globalProjects = data.projects.filter(p => p.region === 'World');
  
  const operationalCount = indiaProjects.filter(p => p.status.includes('Operational')).length;
  const underConstructionCount = indiaProjects.filter(p => p.status.includes('Under Construction')).length;
  const proposedCount = indiaProjects.filter(p => p.status === 'Proposed').length;
  
  document.getElementById('india-cities').textContent = indiaProjects.length;
  document.getElementById('india-stations').textContent = indiaProjects.reduce((sum, p) => sum + p.stations, 0);
  document.getElementById('india-operational').textContent = operationalCount;
  document.getElementById('india-construction').textContent = underConstructionCount;
  document.getElementById('india-planned').textContent = proposedCount;
  
  // Global stats
  const globalOperational = globalProjects.filter(p => p.status.includes('Operational')).length;
  const globalUnderConstruction = globalProjects.filter(p => p.status.includes('Under Construction')).length;
  const uniqueCountries = new Set(globalProjects.map(p => p.country)).size;
  
  document.getElementById('global-countries').textContent = uniqueCountries;
  document.getElementById('global-systems').textContent = globalProjects.length;
  document.getElementById('global-stations').textContent = globalProjects.reduce((sum, p) => sum + p.stations, 0);
}

// Function to populate India city dropdown
function populateCityDropdown(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India');
  const dropdown = document.getElementById('metro-city-dropdown');
  
  dropdown.innerHTML = '<option value="">Select an Indian city...</option>';
  indiaProjects.forEach(metro => {
    const option = document.createElement('option');
    option.value = metro.id;
    option.textContent = metro.city + ' Metro';
    dropdown.appendChild(option);
  });
  
  dropdown.addEventListener('change', function() {
    if (this.value) {
      const selectedMetro = indiaProjects.find(p => p.id === parseInt(this.value));
      displayCityDetails(selectedMetro);
    } else {
      resetCityDetails();
    }
  });
}

// Function to populate Global city dropdown
function populateGlobalCityDropdown(data) {
  const globalProjects = data.projects.filter(p => p.region === 'World');
  const dropdown = document.getElementById('global-city-dropdown');
  
  if (!dropdown) return; // Skip if element doesn't exist
  
  dropdown.innerHTML = '<option value="">Select a global city...</option>';
  globalProjects.forEach(metro => {
    const option = document.createElement('option');
    option.value = metro.id;
    option.textContent = metro.city + ' (' + metro.country + ')';
    dropdown.appendChild(option);
  });
  
  dropdown.addEventListener('change', function() {
    if (this.value) {
      const selectedMetro = globalProjects.find(p => p.id === parseInt(this.value));
      displayGlobalCityDetails(selectedMetro);
    } else {
      resetGlobalCityDetails();
    }
  });
}

// Function to display city details
function displayCityDetails(metro) {
  document.getElementById('selected-city-name').textContent = metro.city + ' Metro';
  document.getElementById('selected-city-status').textContent = metro.status;
  document.getElementById('selected-city-lines').textContent = metro.lines;
  document.getElementById('selected-city-stations').textContent = metro.stations;
  document.getElementById('selected-city-year').textContent = metro.launchYear || 'Coming soon';
  
  let description = `<strong>${metro.city} Metro Rail:</strong><br>
Status: ${metro.status}<br>
Number of Lines: ${metro.lines}<br>
Total Stations: ${metro.stations}<br>
Network Length: ${metro.networkLength}<br>
Operational Since: ${metro.launchYear || 'Planned'}`;
  document.getElementById('city-description').innerHTML = description;
}

// Function to display global city details
function displayGlobalCityDetails(metro) {
  document.getElementById('selected-global-city-name').textContent = metro.city + ' - ' + metro.country;
  document.getElementById('selected-global-city-status').textContent = metro.status;
  document.getElementById('selected-global-city-lines').textContent = metro.lines;
  document.getElementById('selected-global-city-stations').textContent = metro.stations;
  document.getElementById('selected-global-city-year').textContent = metro.launchYear;
  
  let description = `<strong>${metro.name}</strong><br>
City: ${metro.city}, ${metro.country}<br>
Status: ${metro.status}<br>
Number of Lines: ${metro.lines}<br>
Total Stations: ${metro.stations}<br>
Network Length: ${metro.networkLength}<br>
Launch Year: ${metro.launchYear}`;
  document.getElementById('global-city-description').innerHTML = description;
}

// Function to reset city details
function resetCityDetails() {
  document.getElementById('selected-city-name').textContent = 'Select a city from dropdown';
  document.getElementById('selected-city-status').textContent = '-';
  document.getElementById('selected-city-lines').textContent = '-';
  document.getElementById('selected-city-stations').textContent = '-';
  document.getElementById('selected-city-year').textContent = '-';
  document.getElementById('city-description').textContent = 'Select a city to view detailed information';
}

// Function to reset global city details
function resetGlobalCityDetails() {
  document.getElementById('selected-global-city-name').textContent = 'Select a city from dropdown';
  document.getElementById('selected-global-city-status').textContent = '-';
  document.getElementById('selected-global-city-lines').textContent = '-';
  document.getElementById('selected-global-city-stations').textContent = '-';
  document.getElementById('selected-global-city-year').textContent = '-';
  document.getElementById('global-city-description').textContent = 'Select a city to view detailed information';
}

// Function to display latest news
function displayNews(data) {
  const newsList = document.getElementById('news-list');
  const latestNews = data.news ? data.news.slice(0, 5) : []; // Show top 5 latest news
  
  if (latestNews.length === 0) {
    newsList.innerHTML = '<li>No news available</li>';
    return;
  }
  
  let newsHTML = '';
  latestNews.forEach(news => {
    newsHTML += `
    <li>
      <h3>${news.title}</h3>
      <p>${news.description}</p>
      <small>📅 ${news.date} | 📍 ${news.location}</small>
    </li>
    `;
  });
  
  newsList.innerHTML = newsHTML;
}

// Function to create clickable city list
function createCityClickableList(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India');
  const cityListContainer = document.getElementById('india-metro-cards');
  
  if (!cityListContainer) return;
  
  let cardsHTML = '';
  indiaProjects.forEach(metro => {
    const statusColor = metro.status === 'Operational' ? '#4CAF50' : metro.status.includes('Under') ? '#FFC107' : '#2196F3';
    cardsHTML += `
    <div class="metro-card" onclick="displayCityDetails(${JSON.stringify(metro).replace(/"/g, '&quot;')}); document.getElementById('metro-city-dropdown').value = ${metro.id};" style="cursor: pointer; padding: 15px; margin: 10px 0; border-left: 4px solid ${statusColor}; background: #f5f5f5; border-radius: 4px;">
      <h4>${metro.city} Metro</h4>
      <p>Status: <strong>${metro.status}</strong></p>
      <p>Lines: ${metro.lines} | Stations: ${metro.stations}</p>
    </div>
    `;
  });
  
  cityListContainer.innerHTML = cardsHTML;
}

// Auto-refresh data every 5 minutes (300000 milliseconds)
setInterval(loadMetroData, 300000);

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadMetroData);

// Manual refresh function
function manualRefresh() {
  console.log('Manually refreshing data...');
  loadMetroData();
}
