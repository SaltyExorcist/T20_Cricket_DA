import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut,Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SeasonOverview({ season }) {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/season-overview?year=${season}`)
      .then(response => setOverview(response.data));
  }, [season]);

  if (!overview) return <div>Loading...</div>;

  const teamPerformanceData = {
    labels: overview.team_performance.map(team => team.team),
    datasets: [{
      label: 'Wins',
      data: overview.team_performance.map(team => team.wins),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  const topScorersData = {
    labels: overview.top_scorers.map(player => player.name),
    datasets: [{
      data: overview.top_scorers.map(player => player.runs),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  const topBowlersData = {
    labels: overview.top_bowlers.map(player => player.name),
    datasets: [{
      data: overview.top_bowlers.map(player => player.wickets),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  return (
    <div className="season-overview">
      <h2>Season {season} Overview</h2>
      <div className="chart-container">
        <h3>Team Performance</h3>
        <Bar data={teamPerformanceData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h3>Top Scorers</h3>
        <Bar data={topScorersData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h3>Top Bowlers</h3>
        <Bar data={topBowlersData} options={{ responsive: true }} />
      </div>
      <h3>Season Highlights</h3>
      <ul>
        {overview.highlights.map((highlight, index) => (
          <li key={index}>{highlight}</li>
        ))}
      </ul>
    </div>
  );
}

export default SeasonOverview;