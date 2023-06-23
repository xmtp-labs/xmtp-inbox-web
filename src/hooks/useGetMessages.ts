import type { DecodedMessage } from "@xmtp/react-sdk";
import { SortDirection, useMessages } from "@xmtp/react-sdk";
import { useCallback } from "react";
import { ContentTypeReaction } from "@xmtp/content-type-reaction";
import { MESSAGE_LIMIT, getAddress } from "../helpers";
import { useXmtpStore } from "../store/xmtp";

const useGetMessages = (conversationId: string) => {
  const messages = useXmtpStore((state) =>
    state.convoMessages.get(conversationId),
  );

  const addReactions = useXmtpStore((state) => state.addReactions);

  const conversation = useXmtpStore((state) =>
    state.conversations.get(getAddress(conversationId)),
  );
  const addMessages = useXmtpStore((state) => state.addMessages);

  const onMessages = useCallback(
    (messages: DecodedMessage[]) => {
      const reactions: DecodedMessage[] = [];
      // filter out reaction messages
      const msgs = messages
        .map((msg) => {
          if (ContentTypeReaction.sameAs(msg.contentType)) {
            reactions.push(msg);
            return null;
          }
          return msg;
        })
        .filter(Boolean) as DecodedMessage[];

      // add reactions to state
      addReactions(reactions);
      // add messages to state
      addMessages(conversationId, msgs);
    },
    [addMessages, conversationId],
  );

  const { next, hasMore, isLoading } = useMessages(conversation, {
    direction: SortDirection.SORT_DIRECTION_DESCENDING,
    limit: MESSAGE_LIMIT,
    onMessages,
  });

  return {
    messages,
    next,
    hasMore,
    isLoading,
  };
};

export default useGetMessages;
