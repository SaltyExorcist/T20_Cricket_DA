import { Link } from 'react-router-dom';
import BattingStatsScatterplot from '../components/ScatterPlots/BattingStatsScatterplot';
import BowlingStatsScatterplot from '../components/ScatterPlots/BowlingStatsScatterplot';
import RunDistributionHistogram from '../components/RunDistributionHistogram';

const About = () => {
  return (
    <div>
      <BattingStatsScatterplot />
      <BowlingStatsScatterplot />
      <RunDistributionHistogram playerName="Virat Kohli"/>
    </div>
  );
};

export default About;
