import { useEffect } from "react";
import { fetchEnsAddress } from "wagmi/actions";
import { useNavigate, useParams } from "react-router-dom";
import { useXmtpStore } from "../store/xmtp";
import { isEnsAddress, isValidRecipientAddressFormat } from "../helpers";

const DmPage = () => {
  const navigate = useNavigate();
  const { address } = useParams();
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );

  useEffect(() => {
    const routeToInbox = async () => {
      let recipient = address;
      if (recipient && isValidRecipientAddressFormat(recipient)) {
        if (isEnsAddress(recipient)) {
          recipient =
            (await fetchEnsAddress({
              name: recipient,
            })) ?? "";
        }
        if (recipient) {
          setRecipientWalletAddress(recipient);
          navigate("/inbox");
        } else {
          navigate("/");
        }
      } else {
        navigate("/inbox");
      }
    };
    void routeToInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientWalletAddress]);

  return null;
};

export default DmPage;
