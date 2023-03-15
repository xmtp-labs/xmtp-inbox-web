import { useCallback } from "react";
import { useXmtpStore } from "../store/xmtp";

const useSendMessage = (conversationId: string) => {
  const conversations = useXmtpStore((state) => state.conversations);
  const selectedConversation = conversations.get(conversationId);

  const sendMessage = useCallback(
    async (message: string) => {
      await selectedConversation?.send(message);
    },
    [selectedConversation],
  );

  return {
    sendMessage,
  };
};

export default useSendMessage;
