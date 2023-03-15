import React, { useEffect } from "react";
import { Conversation } from "@xmtp/xmtp-js";
import { getConversationId, isEnsAddress } from "../helpers";
import { useXmtpStore } from "../store/xmtp";
import { fetchEnsAddress } from "@wagmi/core";
import NoConversationsMessage from "./Conversation/NoConversationMessage";
import ConversationTile from "./Conversation/ConversationTile";

const ConversationsList = (): JSX.Element => {
  const conversations = useXmtpStore((state) => state.conversations);
  const previewMessages = useXmtpStore((state) => state.previewMessages);
  const client = useXmtpStore((state) => state.client);
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const setConversationId = useXmtpStore((state) => state.setConversationId);
  const setConversations = useXmtpStore((state) => state.setConversations);

  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation,
  ): number => {
    const convoALastMessageDate =
      previewMessages.get(getConversationId(convoA))?.sent || new Date();
    const convoBLastMessageDate =
      previewMessages.get(getConversationId(convoB))?.sent || new Date();
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1;
  };

  useEffect(() => {
    const resolveRouting = async () => {
      const path = window?.location?.pathname ?? "";
      if (path.includes("/dm/")) {
        let convoKey = path.split("/dm/")[1];
        if (isEnsAddress(convoKey)) {
          const address = await fetchEnsAddress({
            name: convoKey,
          });
          convoKey = address ?? "";
        }
        const selectedConversation = conversations.get(convoKey);
        if (selectedConversation) {
          setRecipientWalletAddress(selectedConversation.peerAddress);
          setConversationId(convoKey);
        } else if (convoKey !== "") {
          try {
            const recipientAddress = convoKey.split("/")[0];
            const canMessage = await client?.canMessage(recipientAddress);
            if (canMessage) {
              console.log("Creating convo 2")
              const conversation = await client?.conversations?.newConversation(
                recipientAddress,
              );
              if (conversation) {
                setRecipientWalletAddress(conversation?.peerAddress);
                setConversationId(recipientAddress);
                conversations.set(
                  getConversationId(conversation),
                  conversation,
                );
                setConversations(new Map(conversations));
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
        window.history.replaceState(
          {},
          "Chat Via XMTP",
          window.location.href.split("/dm/")[0],
        );
      }
    };
    resolveRouting();
  }, [window?.location?.pathname]);

  if (!conversations || conversations.size == 0) {
    return <NoConversationsMessage />;
  }

  return (
    <>
      {conversations &&
        conversations.size > 0 &&
        Array.from(conversations.values())
          .sort(orderByLatestMessage)
          .map((convo) => {
            return (
              <ConversationTile
                key={getConversationId(convo)}
                conversation={convo}
              />
            );
          })}
    </>
  );
};

export default React.memo(ConversationsList);
