import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerStats.css'
import PlayerPerformanceChart from '../PlayerPerformanceChart';
import PlayerContributionTreemap from '../PlayerContributionTreemap';
import PlayerRoleAnalysis from '../PlayerRoleAnalysis';

function PlayerStats({ player }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/player-stats?player=${player}`)
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching player stats:', error));
  }, [player]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="player-stats">
      <PlayerPerformanceChart playerName={player} />
      <PlayerContributionTreemap teamName="Royal Challengers Bangalore" season="2016" />
      <h2>{player} Statistics</h2>
      
      <div className="stats-container">
        <h3>Batting</h3>
        {stats.batting ? (
          <table className="stats-table">
            <tbody>
              <tr>
                <th>Total Runs</th>
                <td>{stats.batting.total_runs ||'N/A'}</td>
              </tr>
              <tr>
                <th>Balls Faced</th>
                <td>{stats.batting.balls_faced ||'N/A'}</td>
              </tr>
              <tr>
                <th>Strike Rate</th>
                <td>{stats.batting.strike_rate ||'N/A'}</td>
              </tr>
              <tr>
                <th>Average</th>
                <td>{stats.batting.average ||'N/A'}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No batting data available</p>
        )}
      </div>

      <div className="stats-container">
        <h3>Bowling</h3>
        {stats.bowling ? (
          <table className="stats-table">
            <tbody>
              <tr>
                <th>Wickets</th>
                <td>{stats.bowling.wickets ||'N/A'}</td>
              </tr>
              <tr>
                <th>Economy Rate</th>
                <td>{stats.bowling.economy_rate ||'N/A'}</td>
              </tr>
              <tr>
                <th>Average</th>
                <td>{stats.bowling.average ||'N/A'}</td>
              </tr>
              <tr>
                <th>Strike Rate</th>
                <td>{stats.bowling.strike_rate ||'N/A'}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No bowling data available</p>
        )}
        <PlayerRoleAnalysis playerName='Jasprit Bumrah'/>
      </div>
    </div>
  );
}

export default PlayerStats;