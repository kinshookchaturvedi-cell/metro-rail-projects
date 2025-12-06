// Metro Rail Projects Tracker - Main JavaScript

// Function to load data from data.json
async function loadMetroData() {
  try {
    const response = await fetch('data/projects.json');
    const data = await response.json();
    displayStats(data);
    displayNews(data);
    populateCityDropdown(data);
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
  
  document.getElementById('india-cities').textContent = indiaProjects.length;
  document.getElementById('india-stations').textContent = indiaProjects.reduce((sum, p) => sum + p.stations, 0);
  document.getElementById('india-operational').textContent = indiaProjects.filter(p => p.status === 'Operational').length;
  document.getElementById('india-construction').textContent = indiaProjects.filter(p => p.status === 'Under Construction').length;
  document.getElementById('india-planned').textContent = indiaProjects.filter(p => p.status === 'Planned').length;
  
  document.getElementById('global-countries').textContent = globalProjects.length;
  document.getElementById('global-systems').textContent = globalProjects.length;
  document.getElementById('global-stations').textContent = globalProjects.reduce((sum, p) => sum + p.stations, 0);
}

// Function to populate city dropdown
function populateCityDropdown(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India');
  const dropdown = document.getElementById('metro-city-dropdown');
  
  indiaProjects.forEach(metro => {
    const option = document.createElement('option');
    option.value = metro.id;
    option.textContent = metro.city + ' Metro';
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

// Function to display city details
function displayCityDetails(metro) {
  document.getElementById('selected-city-name').textContent = metro.city + ' Metro';
  document.getElementById('selected-city-status').textContent = metro.status;
  document.getElementById('selected-city-lines').textContent = metro.lines;
  document.getElementById('selected-city-stations').textContent = metro.stations;
  document.getElementById('selected-city-year').textContent = metro.launchYear;
  
  let description = `<strong>${metro.city} Metro Rail:</strong><br>\nStatus: ${metro.status}<br>\nNumber of Lines: ${metro.lines}<br>\nTotal Stations: ${metro.stations}<br>\nOperational Since: ${metro.launchYear}`;
  document.getElementById('city-description').innerHTML = description;
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

// Function to display latest news
function displayNews(data) {
  const newsList = document.getElementById('news-list');
  const latestNews = data.news.slice(0, 5); // Show top 5 latest news
  
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

// Auto-refresh data every 5 minutes (300000 milliseconds)
setInterval(loadMetroData, 300000);

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadMetroData);
