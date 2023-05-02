import { DecodedMessage, SortDirection } from "@xmtp/xmtp-js";
import { useCallback } from "react";
import { MESSAGE_LIMIT } from "../helpers";
import { useXmtpStore } from "../store/xmtp";
import { useMessages } from "@xmtp/react-sdk";

const useGetMessages = (conversationId: string) => {
  const messages = useXmtpStore((state) =>
    state.convoMessages.get(conversationId),
  );
  const conversation = useXmtpStore((state) =>
    state.conversations.get(conversationId),
  );
  const addMessages = useXmtpStore((state) => state.addMessages);

  const onMessages = useCallback(
    (messages: DecodedMessage[]) => {
      console.log(messages);
      addMessages(conversationId, messages);
    },
    [addMessages, conversationId],
  );

  const { next } = useMessages(conversation, {
    direction: SortDirection.SORT_DIRECTION_DESCENDING,
    limit: MESSAGE_LIMIT,
    onMessages,
  });

  return {
    messages,
    next,
  };
};

export default useGetMessages;
