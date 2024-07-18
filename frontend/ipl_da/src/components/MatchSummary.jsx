import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, ArcElement);

function MatchSummary({ matchId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/match-summary?match_id=${matchId}`)
      .then(response => setSummary(response.data))
      .catch(error => console.error('Error fetching match summary:', error));
  }, [matchId]);

  if (!summary || !summary.innings ) return <div>Loading...</div>;

  const scoreData = {
    labels: summary.innings.map(inning => `${inning.team_bat} Innings`),
    datasets: [{
      label: 'Runs Scored',
      data: summary.innings.map(inning => inning.total_runs),
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
    }]
  };

  const wicketsData = {
    labels: summary.innings.map(inning => `${inning.team_bowl} Bowling`),
    datasets: [{
      data: summary.innings.map(inning => inning.wickets),
      backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'],
    }]
  };

  return (
    <div className="match-summary">
      <h2>Match Summary: {summary.innings[0].team_bat} vs {summary.innings[1].team_bat}</h2>
      <p>Date: {summary.innings[0].date}, Venue: {summary.innings[0].ground}</p>
      <p>Result: {summary.innings[0].winner}</p>
      <div className="chart-container">
        <h3>Scores</h3>
        <Bar data={scoreData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h3>Wickets</h3>
        <Pie data={wicketsData} options={{ responsive: true }} />
      </div>
      <h3>Key Performances</h3>
      <ul>
        {summary.key_performances.map((performance, index) => (
          <li key={index}>{performance.player}: {performance.achievement}</li>
        ))}
      </ul>
    </div>
  );
}

export default MatchSummary;
