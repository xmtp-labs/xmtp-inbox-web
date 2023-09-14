import { fetchEnsAddress } from "@wagmi/core";
import { useEffect } from "react";
import { useCanMessage } from "@xmtp/react-sdk";
import {
  isEnsAddress,
  isUnsAddress,
  isValidLongWalletAddress,
  RecipientInputMode,
  fetchUnsAddress,
} from "../helpers";
import type { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";

const useGetRecipientInputMode = () => {
  const { canMessage: canMessageUser } = useCanMessage();

  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );

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

  const checkIfOnNetwork = async (address: string) => {
    try {
      const canMessage = await canMessageUser(address);
      if (!canMessage) {
        setRecipientInputMode(RecipientInputMode.NotOnNetwork);
      } else {
        setRecipientInputMode(RecipientInputMode.OnNetwork);
        setRecipientWalletAddress(address);
      }
    } catch (e) {
      setRecipientInputMode(RecipientInputMode.NotOnNetwork);
    }
  };

  useEffect(() => {
    const checkRecipient = async () => {
      try {
        const canMessage = await canMessageUser(recipientWalletAddress);
        if (!canMessage) {
          setRecipientWalletAddress("");
          setRecipientEnteredValue(recipientWalletAddress);
          setRecipientInputMode(RecipientInputMode.NotOnNetwork);
        } else {
          setRecipientInputMode(RecipientInputMode.OnNetwork);
        }
      } catch (e) {
        setRecipientInputMode(RecipientInputMode.NotOnNetwork);
      }
    };
    if (
      recipientWalletAddress &&
      recipientInputMode !== RecipientInputMode.OnNetwork
    ) {
      void checkRecipient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            void checkIfOnNetwork(address);
          } else {
            setRecipientInputMode(RecipientInputMode.InvalidEntry);
          }
        } else if (isUnsAddress(recipientEnteredValue)) {
          setRecipientInputMode(RecipientInputMode.FindingEntry);
          const address = await fetchUnsAddress(recipientEnteredValue);
          if (address) {
            void checkIfOnNetwork(address);
          } else {
            setRecipientInputMode(RecipientInputMode.InvalidEntry);
          }
        } else if (isValidLongWalletAddress(recipientEnteredValue)) {
          void checkIfOnNetwork(recipientEnteredValue as address);
        } else {
          setRecipientInputMode(RecipientInputMode.InvalidEntry);
        }
      }
    };
    void handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientEnteredValue]);

  return {
    recipientInputMode,
    setRecipientInputMode,
    recipientEnteredValue,
    setRecipientEnteredValue,
  };
};

export default useGetRecipientInputMode;
