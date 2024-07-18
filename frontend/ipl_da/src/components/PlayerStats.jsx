import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

function PlayerStats({ player }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/player-stats?player=${player}`)
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching player stats:', error));
  }, [player]);

  if (!stats) return <div>Loading...</div>;

  const battingData = {
    labels: ['Runs', 'Balls Faced', 'Strike Rate', 'Average'],
    datasets: [{
      label: 'Batting Stats',
      data: stats.batting ? [stats.batting.total_runs, stats.batting.balls_faced, stats.batting.strike_rate, stats.batting.average] : [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  const bowlingData = {
    labels: ['Wickets', 'Economy Rate', 'Average', 'Strike Rate'],
    datasets: [{
      label: 'Bowling Stats',
      data: stats.bowling ? [stats.bowling.wickets, stats.bowling.economy_rate, stats.bowling.average, stats.bowling.strike_rate] : [],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    }]
  };


  return (
    <div className="player-stats">
      <h2>{player} Statistics</h2>
      <div className="chart-container">
        <h3>Batting</h3>
        <Bar data={battingData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h3>Bowling</h3>
        <Bar data={bowlingData} options={{ responsive: true }} />
      </div>
    </div>
  );
}

export default PlayerStats;
