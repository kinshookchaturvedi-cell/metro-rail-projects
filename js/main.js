// Metro Rail Projects Tracker - Main JavaScript
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
    createCityClickableList(data);
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('india-stats').innerHTML = 'Error loading data';
    document.getElementById('global-stats').innerHTML = 'Error loading data';
    document.getElementById('news-list').innerHTML = 'Error loading news';
  }
}

// Function to display statistics
function displayStats(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India');
  const globalProjects = data.projects.filter(p => p.region !== 'India');
  
  const operationalCount = indiaProjects.filter(p => p.status.includes('Operational')).length;
  const underConstructionCount = indiaProjects.filter(p => p.status.includes('Under Construction')).length;
  const proposedCount = indiaProjects.filter(p => p.status === 'Proposed').length;
  
  document.getElementById('india-cities').textContent = indiaProjects.length;
  document.getElementById('india-stations').textContent = indiaProjects.reduce((sum, p) => sum + p.stations, 0);
  document.getElementById('india-operational').textContent = operationalCount;
  document.getElementById('india-construction').textContent = underConstructionCount;
  document.getElementById('india-planned').textContent = proposedCount;
  
  document.getElementById('global-countries').textContent = globalProjects.length;
  document.getElementById('global-systems').textContent = globalProjects.length;
  document.getElementById('global-stations').textContent = globalProjects.reduce((sum, p) => sum + p.stations, 0);
}

// Function to populate city dropdown
function populateCityDropdown(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India').sort((a, b) => a.city.localeCompare(b.city));
  const dropdown = document.getElementById('metro-city-dropdown');
  
  // Clear existing options except the first one
  while (dropdown.options.length > 1) {
    dropdown.remove(1);
  }
  
  indiaProjects.forEach(metro => {
    const option = document.createElement('option');
    option.value = metro.id;
    option.textContent = metro.city + ' - ' + metro.status;
    dropdown.appendChild(option);
  });
  
  // Add event listener for dropdown change
  dropdown.addEventListener('change', function() {
    if (this.value) {
      const selectedMetro = indiaProjects.find(p => p.id === parseInt(this.value));
      displayCityDetails(selectedMetro);
    } else {
      resetCityDetails();
    }
  });
}

// Function to create clickable city list
function createCityClickableList(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India').sort((a, b) => a.city.localeCompare(b.city));
  const container = document.getElementById('india-projects-details');
  
  let htmlContent = '<h3>Click on any city to view status:</h3><div class="city-list">';
  
  indiaProjects.forEach(metro => {
    const statusClass = getStatusClass(metro.status);
    htmlContent += `
      <div class="city-card ${statusClass}" onclick="displayCityDetailsFromCard('${metro.id}')">
        <div class="city-name">${metro.city} Metro</div>
        <div class="city-status">Status: ${metro.status}</div>
        <div class="city-details">Lines: ${metro.lines} | Stations: ${metro.stations}</div>
      </div>
    `;
  });
  
  htmlContent += '</div>';
  container.innerHTML = htmlContent;
}

// Function to get status class for styling
function getStatusClass(status) {
  if (status.includes('Operational') && !status.includes('Construction')) return 'operational';
  if (status.includes('Under Construction')) return 'under-construction';
  if (status.includes('Partially')) return 'partially-operational';
  if (status === 'Proposed') return 'proposed';
  return 'default';
}

// Function to display city details from card click
function displayCityDetailsFromCard(metroId) {
  const indiaProjects = allMetroData.projects.filter(p => p.region === 'India');
  const selectedMetro = indiaProjects.find(p => p.id === parseInt(metroId));
  if (selectedMetro) {
    displayCityDetails(selectedMetro);
    // Also update dropdown
    document.getElementById('metro-city-dropdown').value = metroId;
  }
}

// Function to display city details
function displayCityDetails(metro) {
  document.getElementById('selected-city-name').textContent = metro.city + ' Metro';
  document.getElementById('selected-city-status').textContent = metro.status;
  document.getElementById('selected-city-lines').textContent = metro.lines;
  document.getElementById('selected-city-stations').textContent = metro.stations;
  document.getElementById('selected-city-year').textContent = metro.launchYear || 'TBD';
  
  let description = `<strong>${metro.city} Metro Rail Project</strong><br/>`;
  description += `<strong>Status:</strong> ${metro.status}<br/>`;
  description += `<strong>State:</strong> ${metro.state || 'N/A'}<br/>`;
  description += `<strong>Number of Lines:</strong> ${metro.lines}<br/>`;
  description += `<strong>Total Stations:</strong> ${metro.stations}<br/>`;
  description += `<strong>Network Length:</strong> ${metro.networkLength || 'N/A'}<br/>`;
  if (metro.launchYear) {
    description += `<strong>Operational Since:</strong> ${metro.launchYear}<br/>`;
  }
  if (metro.expectedCompletion) {
    description += `<strong>Expected Completion:</strong> ${metro.expectedCompletion}<br/>`;
  }
  document.getElementById('city-description').innerHTML = description;
}

// Function to reset city details
function resetCityDetails() {
  document.getElementById('selected-city-name').textContent = 'Select a city from dropdown';
  document.getElementById('selected-city-status').textContent = '-';
  document.getElementById('selected-city-lines').textContent = '-';
  document.getElementById('selected-city-stations').textContent = '-';
  document.getElementById('selected-city-year').textContent = '-';
  document.getElementById('city-description').innerHTML = '<p>Select a city to view detailed information</p>';
}

// Function to display latest news
function displayNews(data) {
  const newsList = document.getElementById('news-list');
  let news = data.news || [];
  const latestNews = news.slice(0, 5); // Show top 5 latest news
  
  if (latestNews.length === 0) {
    newsList.innerHTML = '<li>No news available</li>';
    return;
  }
  
  let newsHTML = '';
  latestNews.forEach(newsItem => {
    newsHTML += `
      <li>
        <h3>${newsItem.title}</h3>
        <p>${newsItem.description}</p>
        <small>📅 ${newsItem.date} | 📍 ${newsItem.location}</small>
      </li>
    `;
  });
  
  newsList.innerHTML = newsHTML;
}

// Auto-refresh data every 5 minutes (300000 milliseconds)
setInterval(loadMetroData, 300000);

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadMetroData);
