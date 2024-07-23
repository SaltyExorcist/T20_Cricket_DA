import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import '../App.css';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const BowlingStatsScatterplot = () => {
  const [scatterData, setScatterData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [economyRange, setEconomyRange] = useState({ min: 0, max: 20 });
  const [averageRange, setAverageRange] = useState({ min: 0, max: 100 });
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/bowlscatter')
      .then(response => {
        const formattedData = response.data.map(item => ({
          x: parseFloat(item.economy),
          y: parseFloat(item.average),
          bowler: item.bowler
        }));
        setScatterData(formattedData);
        setFilteredData(formattedData);
      })
      .catch(error => console.error('Error fetching scatter plot data:', error));
  }, []);

  useEffect(() => {
    if (scatterData) {
      const filtered = scatterData.filter(item => 
        item.x >= economyRange.min && item.x <= economyRange.max &&
        item.y >= averageRange.min && item.y <= averageRange.max &&
        item.bowler.toLowerCase().includes(nameFilter.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [scatterData, economyRange, averageRange, nameFilter]);

  if (!filteredData) return <div>Loading...</div>;

  const data = {
    datasets: [
      {
        label: 'Bowler Stats',
        data: filteredData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Economy',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Average',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.bowler}: Economy: ${point.x.toFixed(2)}, Average: ${point.y.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="scatter">
      <h2>Bowling Statistics: Economy vs Average</h2>
      <div className="filters">
        <div>
          <label>Economy Range:</label>
          <input 
            type="number" 
            value={economyRange.min} 
            onChange={(e) => setEconomyRange({...economyRange, min: parseFloat(e.target.value)})}
          />
          <input 
            type="number" 
            value={economyRange.max} 
            onChange={(e) => setEconomyRange({...economyRange, max: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <label>Average Range:</label>
          <input 
            type="number" 
            value={averageRange.min} 
            onChange={(e) => setAverageRange({...averageRange, min: parseFloat(e.target.value)})}
          />
          <input 
            type="number" 
            value={averageRange.max} 
            onChange={(e) => setAverageRange({...averageRange, max: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <label>Bowler Name:</label>
          <input 
            type="text" 
            value={nameFilter} 
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Enter bowler name"
          />
        </div>
      </div>
      <div className="chart-container" style={{ height: '600px', width: '100%' }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default BowlingStatsScatterplot;