import { Link } from 'react-router-dom';
import BattingStatsScatterplot from '../components/ScatterPlots/BattingStatsScatterplot';
import BowlingStatsScatterplot from '../components/ScatterPlots/BowlingStatsScatterplot';

const About = () => {
  return (
    <div>
      <BattingStatsScatterplot />
      <BowlingStatsScatterplot />
    </div>
  );
};

export default About;
