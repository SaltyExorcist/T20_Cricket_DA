import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function PlayerPerformanceChart({ playerName }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState('runs');

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/api/player-performance?player=${playerName}`)
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const formattedData = response.data.map(item => ({
            year: item.year,
            runs: parseInt(item.runs, 10),
            average: parseFloat(item.average),
            strike_rate: parseFloat(item.strike_rate)
          }));
          setData(formattedData);
        } else {
          setError('No data available or invalid data format');
        }
      })
      .catch(error => {
        console.error('Error fetching player data:', error);
        setError('Failed to fetch player data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [playerName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No data available for {playerName}</div>;

  const getColor = (stat) => {
    switch(stat) {
      case 'runs': return "#8884d8";
      case 'average': return "#82ca9d";
      case 'strike_rate': return "#ffc658";
      default: return "#8884d8";
    }
  };

  return (
    <div>
      <select 
        value={selectedStat} 
        onChange={(e) => setSelectedStat(e.target.value)}
        style={{ marginBottom: '20px' }}
      >
        <option value="runs">Runs</option>
        <option value="average">Average</option>
        <option value="strike_rate">Strike Rate</option>
      </select>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey={selectedStat} 
            stroke={getColor(selectedStat)} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlayerPerformanceChart;