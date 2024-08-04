import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

function RunDistributionHistogram({ playerName }) {
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/api/player-run-distribution?player=${playerName}`)
      .then(response => {
        setData(response.data.distribution);
        setTeams(['All', ...new Set(response.data.distribution.map(item => item.opponent))]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching run distribution:', error);
        setError('Failed to fetch run distribution data');
        setLoading(false);
      });
  }, [playerName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredData = selectedTeam === 'All' 
    ? data 
    : data.filter(item => item.opponent === selectedTeam);

  const runRanges = [
    {min: 0, max: 9}, {min: 10, max: 19}, {min: 20, max: 29}, {min: 30, max: 39},
    {min: 40, max: 49}, {min: 50, max: 74}, {min: 75, max: 99}, {min: 100, max: Infinity}
  ];

  const distributionData = runRanges.map(range => ({
    range: `${range.min}-${range.max === Infinity ? '+' : range.max}`,
    count: filteredData.filter(item => item.runs >= range.min && item.runs <= range.max).length
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

  return (
    <div>
      <h3>Run Distribution Histogram for {playerName}</h3>
      <div>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          {teams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={distributionData}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count">
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RunDistributionHistogram;