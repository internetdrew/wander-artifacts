import GetAcquaintedCard from './GetAcquaintedCard';
import SettleInCard from './SettleInCard';
import WelcomeCard from './welcome-card/WelcomeCard';
import WifiCard from './wifi-card/WifiCard';

const WelcomeStack = () => {
  return (
    <div className='space-y-4'>
      <WelcomeCard />
      <GetAcquaintedCard />
      <WifiCard />
      <SettleInCard />
    </div>
  );
};

export default WelcomeStack;
