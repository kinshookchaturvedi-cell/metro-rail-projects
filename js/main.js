// Metro Rail Projects Tracker - Main JavaScript

// Function to load data from data.json
async function loadMetroData() {
  try {
    const response = await fetch('data/projects.json');
    const data = await response.json();
    displayStats(data);
    displayNews(data);
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('india-stats').innerHTML = 'Error loading data';
    document.getElementById('global-stats').innerHTML = 'Error loading data';
    document.getElementById('news-list').innerHTML = 'Error loading news';
  }
}

// Function to display statistics
function displayStats(data) {
  const indiaStats = document.getElementById('india-stats');
  const globalStats = document.getElementById('global-stats');
  
  const indiaCount = data.projects.filter(p => p.region === 'India').length;
  const globalCount = data.projects.filter(p => p.region !== 'India').length;
  
  indiaStats.innerHTML = `
    <div class="stat-box">
      <h3>${indiaCount}</h3>
      <p>India Metro Projects</p>
    </div>
  `;
  
  globalStats.innerHTML = `
    <div class="stat-box">
      <h3>${globalCount}</h3>
      <p>Global Metro Projects</p>
    </div>
  `;
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
