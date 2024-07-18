import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';

function TeamComparison({ team1, team2 }) {
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/team-comparison?team1=${team1}&team2=${team2}`)
      .then(response => setComparisonData(response.data));
  }, [team1, team2]);

  if (!comparisonData) return <div>Loading...</div>;

  const radarData = {
    labels: ['Batting Average', 'Bowling Economy', 'Fielding Efficiency', 'Win Percentage', 'Run Rate'],
    datasets: [
      {
        label: team1,
        data: [
          comparisonData[team1].batting_average,
          comparisonData[team1].bowling_economy,
          comparisonData[team1].fielding_efficiency,
          comparisonData[team1].win_percentage,
          comparisonData[team1].run_rate
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: team2,
        data: [
          comparisonData[team2].batting_average,
          comparisonData[team2].bowling_economy,
          comparisonData[team2].fielding_efficiency,
          comparisonData[team2].win_percentage,
          comparisonData[team2].run_rate
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      }
    ]
  };

  return (
    <div className="team-comparison">
      <h2>Team Comparison: {team1} vs {team2}</h2>
      <div className="chart">
        <Radar data={radarData} />
      </div>
      <div className="head-to-head">
        <h3>Head-to-Head</h3>
        <p>Total Matches: {comparisonData.head_to_head.total_matches}</p>
        <p>{team1} Wins: {comparisonData.head_to_head[team1]}</p>
        <p>{team2} Wins: {comparisonData.head_to_head[team2]}</p>
        <p>Ties/No Results: {comparisonData.head_to_head.ties}</p>
      </div>
    </div>
  );
}

export default TeamComparison;