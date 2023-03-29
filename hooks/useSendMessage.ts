import { ContentTypeId, Conversation } from "@xmtp/xmtp-js";
import { useCallback } from "react";
import { Reaction } from "../codecs/Reaction";

const useSendMessage = (selectedConversation?: Conversation) => {
  const sendMessage = useCallback(
    async (
      message: string | Reaction,
      contentType?: ContentTypeId,
      contentFallback?: string,
    ) => {
      await selectedConversation?.send(message, {
        contentType,
        contentFallback,
      });
    },
    [selectedConversation],
  );

  return {
    sendMessage,
  };
};

export default useSendMessage;
