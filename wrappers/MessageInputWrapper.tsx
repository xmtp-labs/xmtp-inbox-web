import React, { useCallback } from "react";
import { MessageInput } from "../component-library/components/MessageInput/MessageInput";
import { RecipientInputMode, getConversationId } from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import useSendMessage from "../hooks/useSendMessage";
import { useXmtpStore } from "../store/xmtp";
import { address } from "../pages/inbox";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import { GroupChat } from "../lib/GroupChat";
import { group } from "console";

export const MessageInputWrapper = () => {
  // XMTP Hooks
  const { recipientInputMode } = useGetRecipientInputMode();

  const recipientAddresses = useXmtpStore((state) => state.recipientAddresses);
  const { client } = useInitXmtpClient();

  const conversationId = useXmtpStore((state) => state.conversationId);
  const setConversationId = useXmtpStore((state) => state.setConversationId);

  const conversations = useXmtpStore((state) => state.conversations);

  // We don't know if we have a conversation yet, so we can't use the hook
  async function sendMessage(msg: string) {
    if (!conversationId) {
      return;
    }

    const conversation = conversations.get(conversationId);
    await conversation?.send(msg);
  }

  async function onSubmit(msg: string) {
    // No client, bail
    if (!client) {
      return;
    }

    // No recipients, bail
    if (recipientAddresses.length === 0) {
      return;
    }

    // If we've already got a conversation, send the message
    if (conversationId) {
      await sendMessage(msg);
      return;
    }

    // If we don't have a conversation and only one recipient, create a new normal
    // conversation and send the message
    if (recipientAddresses.length === 1) {
      const conversation = await client.conversations.newConversation(
        recipientAddresses[0],
      );

      setConversationId(getConversationId(conversation));
      await sendMessage(msg);
      return;
    }

    // If we don't have a conversation and multiple recipients, create a new group
    // conversation and send the message
    if (recipientAddresses.length > 1) {
      // const conversation = await client.conversations.newGroupConversation(
      //   recipientAddresses,
      // );
      const conversation = await GroupChat.start(client, recipientAddresses);

      setConversationId(getConversationId(conversation));
      await sendMessage(msg);
      return;
    }
  }

  return (
    <MessageInput
      isDisabled={recipientAddresses.length === 0}
      onSubmit={onSubmit}
      recipientAddresses={recipientAddresses}
    />
  );
};
