import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamPerformance from './components/TeamPerformance';
import PlayerStats from './components/PlayerStats';
import MatchSummary from './components/MatchSummary';
import TeamComparison from './components/TeamComparison';
import SeasonOverview from './components/SeasonOverview';
import PlayerMatchup from './components/PlayerMatchup';
import './App.css';
import BattingStatsScatterplot from './components/BattingStatsScatterplot';

// Simple Button component
const Button = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    style={{
      width: '23%', // Match the width of search containers
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: '1px solid #007bff',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px', // Adjust as needed to match your inputs
      transition: 'background-color 0.3s',
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
  >
    {children}
  </button>
);

function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  
  const [teamSearch, setTeamSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [matchSearch, setMatchSearch] = useState('');
  const [seasonSearch, setSeasonSearch] = useState('');
  
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [filteredSeasons, setFilteredSeasons] = useState([]);

  useEffect(() => {
    // Fetch teams, players, matches, and seasons when the component mounts
    axios.get('http://localhost:5000/api/teams')
      .then(response => {
        console.log('Teams:', response.data);
        setTeams(response.data);
      })
      .catch(error => console.error('Error fetching teams:', error));
    
    axios.get('http://localhost:5000/api/players')
      .then(response => {
        console.log('Players:', response.data);
        setPlayers(response.data);
      })
      .catch(error => console.error('Error fetching players:', error));
    
    axios.get('http://localhost:5000/api/matches')
      .then(response => {
        console.log('Matches:', response.data);
        setMatches(response.data);
      })
      .catch(error => console.error('Error fetching matches:', error));

    axios.get('http://localhost:5000/api/seasons')
      .then(response => {
        console.log('Seasons:', response.data);
        setSeasons(response.data);
      })
      .catch(error => console.error('Error fetching seasons:', error));
  }, []);

  useEffect(() => {
    setFilteredTeams(teams.filter(team => 
      team.toLowerCase().includes(teamSearch.toLowerCase())
    ));
  }, [teamSearch, teams]);

  useEffect(() => {
    setFilteredPlayers(players.filter(player => 
      player.toLowerCase().includes(playerSearch.toLowerCase())
    ));
  }, [playerSearch, players]);

  useEffect(() => {
    setFilteredMatches(matches.filter(match => 
      `${match.teams}${match.date}`.toLowerCase().includes(matchSearch.toLowerCase())
    ));
  }, [matchSearch, matches]);

  useEffect(() => {
    setFilteredSeasons(seasons.filter(season => 
      season.toString().includes(seasonSearch)
    ));
  }, [seasonSearch, seasons]);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setTeamSearch('');
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setPlayerSearch('');
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match.p_match);
    setMatchSearch('');
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setSeasonSearch('');
  };

  const resetSearchState = () => {
    setSelectedTeam('');
    setSelectedPlayer('');
    setSelectedMatch('');
    setSelectedSeason('');
    setTeamSearch('');
    setPlayerSearch('');
    setMatchSearch('');
    setSeasonSearch('');
  };

  return (
    <div className="app">
      <h1>IPL Cricket Data Analysis</h1>
      <div className="controls">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for a team"
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
          />
          {teamSearch && (
            <ul className="search-list">
              {filteredTeams.map(team => (
                <li key={team} onClick={() => handleTeamSelect(team)}>
                  {team}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for a player"
            value={playerSearch}
            onChange={(e) => setPlayerSearch(e.target.value)}
          />
          {playerSearch && (
            <ul className="search-list">
              {filteredPlayers.map(player => (
                <li key={player} onClick={() => handlePlayerSelect(player)}>
                  {player}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for a match"
            value={matchSearch}
            onChange={(e) => setMatchSearch(e.target.value)}
          />
          {matchSearch && (
            <ul className="search-list">
              {filteredMatches.map(match => (
                <li key={match.p_match} onClick={() => handleMatchSelect(match)}>
                  {match.teams} {match.date}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for a season"
            value={seasonSearch}
            onChange={(e) => setSeasonSearch(e.target.value)}
          />
          {seasonSearch && (
            <ul className="search-list">
              {filteredSeasons.map(season => (
                <li key={season} onClick={() => handleSeasonSelect(season)}>
                  {season}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <Button onClick={resetSearchState}>Reset Search</Button>
      </div>
      <div className="content">
        {selectedTeam && <TeamPerformance team={selectedTeam} />}
        {selectedPlayer && <PlayerStats player={selectedPlayer} />}
        {selectedMatch && <MatchSummary matchId={selectedMatch} />}
        {selectedSeason && <SeasonOverview season={selectedSeason} />}
        {<PlayerMatchup />}
        {<BattingStatsScatterplot />}
      </div>
    </div>
  );
}

export default App;