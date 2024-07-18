import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamPerformance from './components/TeamPerformance';
import PlayerStats from './components/PlayerStats';
import MatchSummary from './components/MatchSummary';
import TeamComparison from './components/TeamComparison';
import SeasonOverview from './components/SeasonOverview';
import PlayerMatchup from './components/PlayerMatchup';

function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    // Fetch teams, players, matches, and seasons when the component mounts
    axios.get('http://localhost:5000/api/teams')
      .then(response => {
        console.log('Teams:', response.data);  // Log the response
        setTeams(response.data);
      })
      .catch(error => console.error('Error fetching teams:', error));
    
    axios.get('http://localhost:5000/api/players')
      .then(response => {
        console.log('Players:', response.data);  // Log the response
        setPlayers(response.data);
      })
      .catch(error => console.error('Error fetching players:', error));
    
    axios.get('http://localhost:5000/api/matches')
      .then(response => {
        console.log('Matches:', response.data);  // Log the response
        setMatches(response.data);
      })
      .catch(error => console.error('Error fetching matches:', error));

    axios.get('http://localhost:5000/api/seasons')
      .then(response => {
        console.log('Seasons:', response.data);  // Log the response
        setSelectedSeason(response.data[0]);
      })
      .catch(error => console.error('Error fetching seasons:', error));
  }, []);

  return (
    <div className="app">
      <h1>IPL Cricket Data Analysis</h1>
      <div className="controls">
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Select a team</option>
          {teams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
        <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
          <option value="">Select a player</option>
          {players.map(player => <option key={player} value={player}>{player}</option>)}
        </select>
        <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
          <option value="">Select a match</option>
          {matches.map(match => <option key={match.p_match} value={match.p_match}>{match.teams}{match.date}</option>)}
        </select>
      </div>
      <div className="content">
        {selectedTeam && <TeamPerformance team={selectedTeam} />}
        {selectedPlayer && <PlayerStats player={selectedPlayer} />}
        {selectedMatch && <MatchSummary matchId={selectedMatch} />}
        {selectedSeason && <SeasonOverview season={2016} />}
        {<PlayerMatchup />}
      </div>
    </div>
  );
}

export default App;
