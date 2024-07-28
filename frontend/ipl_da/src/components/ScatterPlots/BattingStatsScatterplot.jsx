import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const Button = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: '1px solid #007bff',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
      marginBottom: '20px',
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
  >
    {children}
  </button>
);

const BattingStatsScatterplot = () => {
  const [scatterData, setScatterData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [strikeRateRange, setStrikeRateRange] = useState({ min: 0, max: 250 });
  const [averageRange, setAverageRange] = useState({ min: 0, max: 100 });
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/batscatter')
      .then(response => {
        const formattedData = response.data.map(item => ({
          x: parseFloat(item.strike_rate),
          y: parseFloat(item.average),
          batsman: item.batsman
        }));
        setScatterData(formattedData);
        setFilteredData(formattedData);
      })
      .catch(error => console.error('Error fetching scatter plot data:', error));
  }, []);

  useEffect(() => {
    if (scatterData) {
      const filtered = scatterData.filter(item => 
        item.x >= strikeRateRange.min && item.x <= strikeRateRange.max &&
        item.y >= averageRange.min && item.y <= averageRange.max &&
        item.batsman.toLowerCase().includes(nameFilter.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [scatterData, strikeRateRange, averageRange, nameFilter]);

  if (!filteredData) return <div>Loading...</div>;

  const data = {
    datasets: [
      {
        label: 'Batsmen Stats',
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
          text: 'Strike Rate',
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
            return `${point.batsman}: Strike Rate: ${point.x.toFixed(2)}, Average: ${point.y.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="scatter">
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
      <h2>Batting Statistics: Strike Rate vs Average</h2>
      <div className="filters">
        <div>
          <label>Strike Rate Range:</label>
          <input 
            type="number" 
            value={strikeRateRange.min} 
            onChange={(e) => setStrikeRateRange({...strikeRateRange, min: parseFloat(e.target.value)})}
          />
          <input 
            type="number" 
            value={strikeRateRange.max} 
            onChange={(e) => setStrikeRateRange({...strikeRateRange, max: parseFloat(e.target.value)})}
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
          <label>Batsman Name:</label>
          <input 
            type="text" 
            value={nameFilter} 
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Enter batsman name"
          />
        </div>
      </div>
      <div className="chart-container" style={{ height: '800px', width: '800px', left:'50' }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default BattingStatsScatterplot;