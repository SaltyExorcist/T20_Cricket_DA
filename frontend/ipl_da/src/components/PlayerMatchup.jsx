import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlayerMatchup() {
  const [batsmen, setBatsmen] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [selectedBatsman, setSelectedBatsman] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');
  const [matchupData, setMatchupData] = useState(null);

  useEffect(() => {
    // Fetch list of batsmen and bowlers
    axios.get('http://localhost:5000/api/players')
      .then(response => {
        setBatsmen(response.data);
        setBowlers(response.data);
      })
      .catch(error => console.error('Error fetching players:', error));
  }, []);

  const fetchMatchupData = () => {
    if (selectedBatsman && selectedBowler) {
      axios.get(`http://localhost:5000/api/player-matchup?batsman=${selectedBatsman}&bowler=${selectedBowler}`)
        .then(response => setMatchupData(response.data))
        .catch(error => console.error('Error fetching matchup data:', error));
    }
  };

  return (
    <div className="player-matchup">
      <h2>Player Matchup</h2>
      <div className="player-selection">
        <select 
          value={selectedBatsman} 
          onChange={(e) => setSelectedBatsman(e.target.value)}
        >
          <option value="">Select Batsman</option>
          {batsmen.map(player => (
            <option key={player} value={player}>{player}</option>
          ))}
        </select>
        <select 
          value={selectedBowler} 
          onChange={(e) => setSelectedBowler(e.target.value)}
        >
          <option value="">Select Bowler</option>
          {bowlers.map(player => (
            <option key={player} value={player}>{player}</option>
          ))}
        </select>
        <button onClick={fetchMatchupData}>Get Matchup Data</button>
      </div>
      {matchupData && (
        <div className="matchup-data">
          <h3>{selectedBatsman} vs {selectedBowler}</h3>
          <table>
            <tbody>
              <tr>
                <th>Balls Faced:</th>
                <td>{matchupData.balls_faced}</td>
              </tr>
              <tr>
                <th>Runs Scored:</th>
                <td>{matchupData.runs_scored}</td>
              </tr>
              <tr>
                <th>Dismissals:</th>
                <td>{matchupData.dismissals}</td>
              </tr>
              <tr>
                <th>Strike Rate:</th>
                <td>{matchupData.strike_rate}</td>
              </tr>
              <tr>
                <th>Average:</th>
                <td>{matchupData.average}</td>
              </tr>
              <tr>
                <th>Economy Rate:</th>
                <td>{matchupData.economy_rate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PlayerMatchup;