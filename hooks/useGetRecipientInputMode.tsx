import { fetchEnsAddress } from "@wagmi/core";
import { useEffect, useState } from "react";
import {
  getConversationId,
  isEnsAddress,
  isValidLongWalletAddress,
  RecipientInputMode,
} from "../helpers";
import { address } from "../pages/inbox";
import { useXmtpStore } from "../store/xmtp";
import useWalletAddress from "./useWalletAddress";

const useGetRecipientInputMode = () => {
  const client = useXmtpStore((state) => state.client);
  const recipientWalletAddress = useXmtpStore(
    (state) => state.recipientWalletAddress,
  );
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const storeConversationId =
    useXmtpStore((state) => state.conversationId) || "";

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

  const conversations = useXmtpStore((state) => state.conversations);
  const setConversations = useXmtpStore((state) => state.setConversations);

  const setConversationId = useXmtpStore((state) => state.setConversationId);

  //   // Current conversation by conversation ID
  //   // Since conversationId can be set to an ENS name, we reset it below for those cases to pull from the ENS address
  //   // Resolves bug where entering an existing conversation with ENS name in "new message" doesn't retrieve conversations
  const { ensAddress } = useWalletAddress();
  const conversationId = isEnsAddress(storeConversationId)
    ? ensAddress
    : storeConversationId;

  const checkIfOnNetwork = async (address: string) => {
    let canMessage;
    if (client) {
      try {
        canMessage = await client.canMessage(address);
        if (!canMessage) {
          setRecipientInputMode(RecipientInputMode.NotOnNetwork);
        } else {
          setRecipientInputMode(RecipientInputMode.OnNetwork);
          setRecipientWalletAddress(address);
          setConversationId(address);
        }
      } catch (e) {
        setRecipientInputMode(RecipientInputMode.NotOnNetwork);
      }
    }
  };
  useEffect(() => {
    const setLookupValue = async () => {
      if (isValidLongWalletAddress(recipientWalletAddress)) {
        const conversation =
          conversationId && conversationId !== recipientWalletAddress
            ? await client?.conversations?.newConversation(
                recipientWalletAddress,
                {
                  conversationId,
                  metadata: {},
                },
              )
            : await client?.conversations?.newConversation(
                recipientWalletAddress,
              );
        if (conversation) {
          conversations.set(getConversationId(conversation), conversation);
          setConversations(new Map(conversations));
        }
      }
    };
    if (
      recipientWalletAddress &&
      recipientInputMode !== RecipientInputMode.OnNetwork
    ) {
      setRecipientInputMode(RecipientInputMode.OnNetwork);
    }
    if (recipientInputMode === RecipientInputMode.OnNetwork) {
      setLookupValue();
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
    conversationId,
  };
};

export default useGetRecipientInputMode;
