import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TeamPerformance({ team }) {
  const [performance, setPerformance] = useState(null);
  const [seasonPerformance, setSeasonPerformance] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/team-performance?team=${team}`)
      .then(response => setPerformance(response.data));
      axios.get(`http://localhost:5000/api/team-season-performance?team=${team}`)
      .then(response => setSeasonPerformance(response.data));
  }, [team]);

  if (!performance) return <div>Loading...</div>;

  const overallData = {
    labels: ['Wins', 'Losses', 'Ties'],
    datasets: [{
      label: team,
      data: [performance.wins, performance.losses, performance.ties],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
    }]
  };

  const seasonData = {
    labels: seasonPerformance.map(season => season.year),
    datasets: [{
      label: 'Wins',
      data: seasonPerformance.map(season => season.wins),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }, {
      label: 'Losses',
      data: seasonPerformance.map(season => season.losses),
      borderColor: 'rgba(255, 99, 132, 1)',
      fill: false,
    }]
  };

  return (
    <div className="team-performance">
      <h2>{team} Performance</h2>
      <div className="chart-container">
        <Bar data={overallData} options={{ responsive: true }} />
      </div>
      <h3>Season-wise Performance</h3>
      <div className="chart-container">
        <Line data={seasonData} options={{ responsive: true }} />
      </div>

    </div>
  );
}

export default TeamPerformance;