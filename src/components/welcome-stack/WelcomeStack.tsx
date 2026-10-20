import ComeOnInCard from './ComeOnInCard';
import WelcomeCard from './welcome-card/WelcomeCard';
import WifiCard from './wifi-card/WifiCard';

const WelcomeStack = () => {
  return (
    <div className='space-y-4'>
      <WelcomeCard />
      <ComeOnInCard />
      <WifiCard />
    </div>
  );
};

export default WelcomeStack;
