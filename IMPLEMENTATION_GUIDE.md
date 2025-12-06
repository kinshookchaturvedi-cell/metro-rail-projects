# Implementation Guide: Add Route Kilometres and Daily Ridership Stats with Auto-Update Table

This guide outlines the changes needed to add route kilometres and daily ridership figures to the stats, displayed as an auto-updating table.

## Summary of Changes

### 1. Update data/projects.json
Add two new fields to each project object:
- `routeKilometres`: (number) Total route kilometers of the metro system
- `dailyRidership`: (number) Average daily ridership in the system

Example for Delhi Metro:
```json
{
  "id": 1,
  "name": "Delhi Metro",
  "city": "Delhi",
  "state": "Delhi",
  "region": "India",
  "status": "Operational",
  "lines": 11,
  "stations": 254,
  "networkLength": "393.417 km",
  "launchYear": 2002,
  "routeKilometres": 393.417,
  "dailyRidership": 6500000
}
```

### 2. Update index.html

#### Replace Stats Grid Section (Lines 103-126):

**FIND THIS:**
```html
<div class="stats-grid">
  <div id="india-stats" class="stat-card">
    <h3>India Metro Projects</h3>
    <div class="stat-content">
      <p><strong>Total Cities:</strong> <span id="india-cities">Loading...</span></p>
      <p><strong>Operational Lines:</strong> <span id="india-operational">Loading...</span></p>
      <p><strong>Under Construction:</strong> <span id="india-construction">Loading...</span></p>
      <p><strong>Planned Projects:</strong> <span id="india-planned">Loading...</span></p>
      <p><strong>Total Stations:</strong> <span id="india-stations">Loading...</span></p>
    </div>
    <a href="#india-metro-section" class="view-details">View India Summary ↓</a>
  </div>
  <div id="global-stats" class="stat-card">
    <h3>Global Metro Projects</h3>
    <div class="stat-content">
      <p><strong>Total Countries:</strong> <span id="global-countries">Loading...</span></p>
      <p><strong>Total Systems:</strong> <span id="global-systems">Loading...</span></p>
      <p><strong>Total Stations:</strong> <span id="global-stations">Loading...</span></p>
    </div>
    <a href="global.html" class="view-details">View Global Projects →</a>
  </div>
</div>
```

**REPLACE WITH:**
```html
<div class="stats-tables">
  <div id="india-stats" class="stat-table-container">
    <h3>India Metro Projects Statistics</h3>
    <table class="stats-table" id="india-stats-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Cities</td>
          <td><span id="india-cities">Loading...</span></td>
        </tr>
        <tr>
          <td>Total Route Kilometres</td>
          <td><span id="india-route-km">Loading...</span> km</td>
        </tr>
        <tr>
          <td>Daily Ridership (Total)</td>
          <td><span id="india-daily-ridership">Loading...</span></td>
        </tr>
        <tr>
          <td>Operational Systems</td>
          <td><span id="india-operational">Loading...</span></td>
        </tr>
        <tr>
          <td>Under Construction</td>
          <td><span id="india-construction">Loading...</span></td>
        </tr>
        <tr>
          <td>Planned Projects</td>
          <td><span id="india-planned">Loading...</span></td>
        </tr>
        <tr>
          <td>Total Stations</td>
          <td><span id="india-stations">Loading...</span></td>
        </tr>
      </tbody>
    </table>
    <a href="#india-metro-section" class="view-details">View India Summary ↓</a>
  </div>
  <div id="global-stats" class="stat-table-container">
    <h3>Global Metro Projects Statistics</h3>
    <table class="stats-table" id="global-stats-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Countries</td>
          <td><span id="global-countries">Loading...</span></td>
        </tr>
        <tr>
          <td>Total Systems</td>
          <td><span id="global-systems">Loading...</span></td>
        </tr>
        <tr>
          <td>Total Route Kilometres</td>
          <td><span id="global-route-km">Loading...</span> km</td>
        </tr>
        <tr>
          <td>Daily Ridership (Total)</td>
          <td><span id="global-daily-ridership">Loading...</span></td>
        </tr>
        <tr>
          <td>Total Stations</td>
          <td><span id="global-stations">Loading...</span></td>
        </tr>
      </tbody>
    </table>
    <a href="global.html" class="view-details">View Global Projects →</a>
  </div>
</div>
```

#### Add CSS for Tables (Add to <style> section, around line 8):
```css
/* Stats Table Styling */
.stats-tables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
}

.stat-table-container {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-table-container h3 {
  color: #1e3c72;
  margin-bottom: 15px;
  font-size: 18px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.stats-table thead {
  background: #2a5298;
  color: white;
}

.stats-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #1e3c72;
}

.stats-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.stats-table tbody tr:hover {
  background: #f0f0f0;
  transition: background 0.2s ease;
}

.stats-table tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .stats-tables {
    grid-template-columns: 1fr;
  }
}
```

### 3. Update js/main.js

Modify the `displayStats()` function to calculate and display the new fields.

**FIND THIS FUNCTION:**
```javascript
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
```

**REPLACE WITH:**
```javascript
function displayStats(data) {
  const indiaProjects = data.projects.filter(p => p.region === 'India');
  const globalProjects = data.projects.filter(p => p.region === 'World');
  
  const operationalCount = indiaProjects.filter(p => p.status.includes('Operational')).length;
  const underConstructionCount = indiaProjects.filter(p => p.status.includes('Under Construction')).length;
  const proposedCount = indiaProjects.filter(p => p.status === 'Proposed').length;
  
  // Calculate totals for India
  const indiaRouteKm = indiaProjects.reduce((sum, p) => sum + (p.routeKilometres || 0), 0);
  const indiaDailyRidership = indiaProjects.reduce((sum, p) => sum + (p.dailyRidership || 0), 0);
  
  document.getElementById('india-cities').textContent = indiaProjects.length;
  document.getElementById('india-route-km').textContent = indiaRouteKm.toFixed(2);
  document.getElementById('india-daily-ridership').textContent = formatNumber(indiaDailyRidership);
  document.getElementById('india-stations').textContent = indiaProjects.reduce((sum, p) => sum + p.stations, 0);
  document.getElementById('india-operational').textContent = operationalCount;
  document.getElementById('india-construction').textContent = underConstructionCount;
  document.getElementById('india-planned').textContent = proposedCount;
  
  // Global stats
  const globalOperational = globalProjects.filter(p => p.status.includes('Operational')).length;
  const globalUnderConstruction = globalProjects.filter(p => p.status.includes('Under Construction')).length;
  const uniqueCountries = new Set(globalProjects.map(p => p.country)).size;
  
  // Calculate totals for Global
  const globalRouteKm = globalProjects.reduce((sum, p) => sum + (p.routeKilometres || 0), 0);
  const globalDailyRidership = globalProjects.reduce((sum, p) => sum + (p.dailyRidership || 0), 0);
  
  document.getElementById('global-countries').textContent = uniqueCountries;
  document.getElementById('global-systems').textContent = globalProjects.length;
  document.getElementById('global-route-km').textContent = globalRouteKm.toFixed(2);
  document.getElementById('global-daily-ridership').textContent = formatNumber(globalDailyRidership);
  document.getElementById('global-stations').textContent = globalProjects.reduce((sum, p) => sum + p.stations, 0);
}

// Helper function to format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + ' K';
  }
  return num.toLocaleString();
}
```

## Auto-Update Feature

The code already includes auto-update functionality that refreshes data every 5 minutes (300,000 milliseconds). The `setInterval(loadMetroData, 300000);` line in main.js handles this automatically.

## Sample Data for New Fields

Add these values to projects.json for reference:
- Delhi Metro: routeKilometres: 393.417, dailyRidership: 6500000
- Mumbai Metro: routeKilometres: 67.17, dailyRidership: 3200000
- Bangalore Metro: routeKilometres: 94.34, dailyRidership: 1800000
- Hyderabad Metro: routeKilometres: 69.24, dailyRidership: 1500000
- Chennai Metro: routeKilometres: 54.1, dailyRidership: 1200000

## Testing

1. After making changes, verify the stats display as tables
2. Check that totals are calculated correctly
3. Verify numbers display with proper formatting (K for thousands, M for millions)
4. Monitor that data auto-updates every 5 minutes

## Deployment

Once all changes are committed, the GitHub Pages site will automatically redeploy within minutes.
