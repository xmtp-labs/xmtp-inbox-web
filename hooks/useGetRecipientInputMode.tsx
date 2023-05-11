import { fetchEnsAddress } from "@wagmi/core";
import { useEffect } from "react";
import {
  isEnsAddress,
  isValidLongWalletAddress,
  RecipientInputMode,
} from "../helpers";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";
import { useCanMessage } from "@xmtp/react-sdk";

const useGetRecipientInputMode = () => {
  const { canMessage: canMessageUser } = useCanMessage();

  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const setConversationId = useXmtpStore((state) => state.setConversationId);

  const recipientInputMode = useXmtpStore((state) => state.recipientInputMode);
  const setRecipientInputMode = useXmtpStore(
    (state) => state.setRecipientInputMode,
  );

  const recipientEnteredValue = useXmtpStore(
    (state) => state.recipientEnteredValue,
  );
  const setRecipientEnteredValue = useXmtpStore(
    (state) => state.setRecipientEnteredValue,
  );

  const recipientAddresses = useXmtpStore((state) => state.recipientAddresses);
  const setRecipientAddresses = useXmtpStore(
    (state) => state.setRecipientAddresses,
  );

  const checkIfOnNetwork = async (address: string) => {
    try {
      const canMessage = await canMessageUser(address);
      if (!canMessage) {
        setRecipientInputMode(RecipientInputMode.NotOnNetwork);
      } else {
        setRecipientInputMode(RecipientInputMode.OnNetwork);
        console.log("ADDING ADDRESS", address);
        setRecipientAddresses([...recipientAddresses, address]);
        // When coming from the input (vs the preview panel), conversation ids will always be in XMTP format.
        // setConversationId(address);
      }
    } catch (e) {
      setRecipientInputMode(RecipientInputMode.NotOnNetwork);
    }
  };
  useEffect(() => {
    if (
      recipientWalletAddress &&
      recipientInputMode !== RecipientInputMode.OnNetwork
    ) {
      setRecipientInputMode(RecipientInputMode.OnNetwork);
    }
  }, [recipientInputMode, recipientWalletAddress]);

  useEffect(() => {
    const handleSubmit = async () => {
      if (recipientEnteredValue) {
        if (isEnsAddress(recipientEnteredValue)) {
          setRecipientInputMode(RecipientInputMode.FindingEntry);
          const address = await fetchEnsAddress({
            name: recipientEnteredValue,
          });
          if (address) {
            checkIfOnNetwork(address);
          } else {
            setRecipientInputMode(RecipientInputMode.InvalidEntry);
          }
        } else if (isValidLongWalletAddress(recipientEnteredValue)) {
          checkIfOnNetwork(recipientEnteredValue as address);
        } else {
          setRecipientInputMode(RecipientInputMode.InvalidEntry);
        }
      }
    };
    handleSubmit();
  }, [recipientEnteredValue]);

  return {
    recipientInputMode,
    setRecipientInputMode,
    recipientEnteredValue,
    setRecipientEnteredValue,
  };
};

export default useGetRecipientInputMode;
