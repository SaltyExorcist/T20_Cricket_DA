import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const BattingStatsScatterplot = () => {
  const [scatterData, setScatterData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/scatter')
      .then(response => {
        const formattedData = response.data.map(item => ({
          x: parseFloat(item.strike_rate),
          y: parseFloat(item.average),
          batsman: item.batsman
        }));
        setScatterData(formattedData);
      })
      .catch(error => console.error('Error fetching scatter plot data:', error));
  }, []);

  if (!scatterData) return <div>Loading...</div>;

  const data = {
    datasets: [
      {
        label: 'Batsmen Stats',
        data: scatterData,
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
      <h2>Batting Statistics: Strike Rate vs Average</h2>
      <div className="chart-container" style={{ height: '400px', width: '100%' }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default BattingStatsScatterplot;