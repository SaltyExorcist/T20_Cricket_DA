import React from 'react';
import PlayerMatchup from '../components/PlayerMatchup/PlayerMatchup';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function PlayerMatchupPage() {
  return (
    <div className="player-matchup-page">
      <h1>Player Matchup Analysis</h1>
      <PlayerMatchup />
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}

export default PlayerMatchupPage;