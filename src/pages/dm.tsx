import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useXmtpStore } from "../store/xmtp";

const DmPage = () => {
  const navigate = useNavigate();
  const { address } = useParams();
  const setRecipientInput = useXmtpStore((s) => s.setRecipientInput);

  useEffect(() => {
    const routeToInbox = () => {
      // address is present, set address input and go the inbox
      if (address) {
        setRecipientInput(address);
        navigate(`/inbox?peerAddress=${address}`);
      } else {
        navigate("/inbox");
      }
    };
    void routeToInbox();
  }, [address, navigate, setRecipientInput]);

  return null;
};

export default DmPage;
