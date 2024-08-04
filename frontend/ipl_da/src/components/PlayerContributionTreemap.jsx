// PlayerContributionTreemap.jsx
import React, { useState, useEffect } from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function PlayerContributionTreemap({ teamName, season }) {
  const [data, setData] = useState([]);
  const [contributionType, setContributionType] = useState('runs');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/team-contributions?team=${teamName}&season=${season}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Error fetching team contributions:', error));
  }, [teamName, season]);

  const treeMapData = {
    name: 'Players',
    children: data.map(player => ({
      name: player.name,
      size: player[contributionType],
    })),
  };

  return (
    <div>
      <h3>Player Contribution Treemap</h3>
      <select value={contributionType} onChange={(e) => setContributionType(e.target.value)}>
        <option value="runs">Runs</option>
        <option value="wickets">Wickets</option>
      </select>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={treeMapData.children}
          dataKey="size"
          ratio={4/3}
          stroke="#fff"
          fill="#8884d8"
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`${data.name} : ${data.size}`}</p>
      </div>
    );
  }
  return null;
}

export default PlayerContributionTreemap;