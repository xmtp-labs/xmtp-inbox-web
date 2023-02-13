import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="p-10">
      <div className="flex justify-end">Try a demo</div>
      <div className="flex flex-col space-y-4 items-center justify-center m-10">
        <div>img</div>
        <div>Your interoperable web3 inbox</div>
        <div>You’re just a few steps away from secure, wallet-to-wallet messaging</div>
        <button>Connect your wallet</button>
        <div>No private keys will be shared</div>
      </div>
    </div>
  );
};

export default Home;
