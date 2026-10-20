import ComeOnInCard from './come-on-in-card/ComeOnInCard';
import WelcomeCard from './welcome-card/WelcomeCard';

const WelcomeStack = () => {
  return (
    <div className='space-y-4'>
      <WelcomeCard />
      <ComeOnInCard />
    </div>
  );
};

export default WelcomeStack;
