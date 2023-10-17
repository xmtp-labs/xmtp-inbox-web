import { useLocation } from 'react-router-dom';

// A simple hook to pull an optional peerAddress and pre-fill ƒrom a URL
function useMessagePrefill() {
  const params = new URLSearchParams(useLocation().search);

  const peerAddress = params.get('peerAddress');

  return { peerAddress };
}

export default useMessagePrefill;
