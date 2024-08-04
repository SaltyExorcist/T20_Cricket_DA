import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function PlayerRoleAnalysis({ playerName }) {
  const [data, setData] = useState({ batting: [], bowling: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBattingStat, setSelectedBattingStat] = useState('runs');
  const [selectedBowlingStat, setSelectedBowlingStat] = useState('wickets');

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/api/player-role-analysis?player=${playerName}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching player role analysis:', error);
        setError('Failed to fetch player role analysis data');
        setLoading(false);
      });
  }, [playerName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const battingStatsOptions = ['runs', 'strike_rate', 'average'];
  const bowlingStatsOptions = ['wickets', 'economy_rate', 'average', 'strike_rate'];

  return (
    <div>
      <h3>Player Role Analysis for {playerName}</h3>
      <h4>Batting</h4>
      <div>
        <label htmlFor="batting-stats">Select Batting Stat: </label>
        <select
          id="batting-stats"
          value={selectedBattingStat}
          onChange={(e) => setSelectedBattingStat(e.target.value)}
        >
          {battingStatsOptions.map(stat => (
            <option key={stat} value={stat}>{stat.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.batting}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={selectedBattingStat} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      
      <h4>Bowling</h4>
      <div>
        <label htmlFor="bowling-stats">Select Bowling Stat: </label>
        <select
          id="bowling-stats"
          value={selectedBowlingStat}
          onChange={(e) => setSelectedBowlingStat(e.target.value)}
        >
          {bowlingStatsOptions.map(stat => (
            <option key={stat} value={stat}>{stat.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.bowling}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={selectedBowlingStat} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlayerRoleAnalysis;
