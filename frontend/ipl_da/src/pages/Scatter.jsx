import { Link } from 'react-router-dom';
import BattingStatsScatterplot from '../components/BattingStatsScatterplot';
import '../App.css';
import BowlingStatsScatterplot from '../components/BowlingStatsScatterplot';

const About = () => {
  return (
    <div>
      <BattingStatsScatterplot />
      <BowlingStatsScatterplot />
    </div>
  );
};

export default About;
