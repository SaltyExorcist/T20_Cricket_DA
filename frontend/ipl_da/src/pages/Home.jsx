import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import TeamPerformance from '../components/TeamPerformance';
import PlayerStats from '../components/PlayerStats/PlayerStats';
import MatchSummary from '../components/MatchSummary';
import SeasonOverview from '../components/SeasonOverview';
import '../App.css';

function Home() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [seasons, setSeasons] = useState([]);
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    // Fetch teams, players, matches, and seasons when the component mounts
    axios.get('http://localhost:5000/api/teams')
      .then(response => setTeams(response.data))
      .catch(error => console.error('Error fetching teams:', error));
    
    axios.get('http://localhost:5000/api/players')
      .then(response => setPlayers(response.data))
      .catch(error => console.error('Error fetching players:', error));
    
    axios.get('http://localhost:5000/api/matches')
      .then(response => setMatches(response.data))
      .catch(error => console.error('Error fetching matches:', error));

    axios.get('http://localhost:5000/api/seasons')
      .then(response => setSeasons(response.data))
      .catch(error => console.error('Error fetching seasons:', error));
  }, []);

  const resetSearchState = () => {
    setSelectedTeam('');
    setSelectedPlayer('');
    setSelectedMatch('');
    setSelectedSeason('');
  };

  return (
    <div className="app">
      <h1>IPL Cricket Data Analysis</h1>
      <div className="controls">
        <SearchBar
          items={teams}
          placeholder="Search for a team"
          onSelect={setSelectedTeam}
        />
        <SearchBar
          items={players}
          placeholder="Search for a player"
          onSelect={setSelectedPlayer}
        />
        <SearchBar
          items={matches}
          placeholder="Search for a match"
          onSelect={setSelectedMatch}
          itemDisplay={(match) => `${match.teams} ${match.date}`}
        />
        <SearchBar
          items={seasons}
          placeholder="Search for a season"
          onSelect={setSelectedSeason}
        />
        <Button onClick={resetSearchState}>Reset Search</Button>
      </div>
      <div className="content">
        {selectedTeam && <TeamPerformance team={selectedTeam} />}
        {selectedPlayer && <PlayerStats player={selectedPlayer} />}
        {selectedMatch && <MatchSummary matchId={selectedMatch} />}
        {selectedSeason && <SeasonOverview season={selectedSeason} />}
      </div>
      <div className="navigation-buttons">
        <Link to="/scatter">
          <Button>View Batting Stats Scatterplot</Button>
        </Link>
        <Link to="/player-matchup">
          <Button>Player Matchup Analysis</Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;